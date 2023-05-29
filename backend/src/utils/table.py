from __future__ import annotations

import json
from enum import Enum
from pprint import pprint

import mysql.connector as msc

from backend.src.lib import Result
from backend.src.lib.graph import Graph, matrix_transpose, topological_sort


class MigratorQueue:
    queue: list[tuple[str, Table]] = []

    def commit(db: msc.MySQLConnection) -> Result[None, str]:
        # check that all tables are unique
        for i in range(len(MigratorQueue.queue)):
            for j in range(i + 1, len(MigratorQueue.queue)):
                if MigratorQueue.queue[i][0] == MigratorQueue.queue[j][0]:
                    return Result.Err("Table names must be unique.")

        # check that the tables does not yet exist in the db
        cursor = db.cursor()
        for table in MigratorQueue.queue:
            cursor.execute(
                f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{db.database}' AND table_name = '{table[0]}';"
            )
            if cursor.fetchone()[0] != 0:
                return Result.Err(f"Table {table[0]} already exists.")

        # form connection graph
        graph: Graph[str] = Graph(len(MigratorQueue.queue))

        # create label encodings
        enc = {}
        for i in range(len(MigratorQueue.queue)):
            enc[i] = MigratorQueue.queue[i][0]

        # add labels
        graph.set_labels([table[0] for table in MigratorQueue.queue])

        # print(f"queue: {list(map(lambda x: x[0], MigratorQueue.queue))}")
        # pprint(f"Refs: {list(map(lambda x: list(map(lambda r: r[1] + '.' + r[2], x[1].refs)), MigratorQueue.queue))}")

        # add edges
        for i in range(len(MigratorQueue.queue)):
            for j in range(len(MigratorQueue.queue)):
                if MigratorQueue.queue[i][1].is_referencing(MigratorQueue.queue[j][1]):
                    graph.add_edge(MigratorQueue.queue[i][0], MigratorQueue.queue[j][0])

        # pprint(graph.adj_matrix)

        # topological sort
        # also had to matrix transpose because i am dumb idiot that reversed the order of the arrows
        top_sort_res = topological_sort(matrix_transpose(graph.adj_matrix))

        if top_sort_res.is_err():
            return Result.Err(top_sort_res.unwrap_err())

        # print(f"Top sort: {top_sort_res.unwrap()}")
        # print(f"Top sort result: {list(map(lambda x: enc[x], top_sort_res.unwrap()))}")

        # print("FORCE TERMINATING")
        # exit(101)

        # starts committing
        for i in top_sort_res.unwrap():
            table: Table = MigratorQueue.queue[i][1]
            com_res = table.commit(db)
            if com_res.is_err():
                return Result.Err(com_res.unwrap_err())

        # write the log
        cquery = """CREATE TABLE IF NOT EXISTS `migrations_log` (
`id` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`table_name` VARCHAR(255) NOT NULL,
`batch_id` INT NOT NULL,
`order_id` INT NOT NULL,

PRIMARY KEY (`id`)
)
"""

        cursor.execute(cquery)
        db.commit()

        # fetch the highest batch id
        cursor.execute("SELECT MAX(batch_id) FROM `migrations_log`;")
        last_batch_id = cursor.fetchone()[0]
        if last_batch_id is None:
            last_batch_id = 0

        batch_id = last_batch_id + 1

        for i, idx in enumerate(top_sort_res.unwrap()):
            table = MigratorQueue.queue[idx][1]
            query = f"INSERT INTO `migrations_log` (`name`, `table_name`, `batch_id`, `order_id`) VALUES ('migration_{table.name}', '{table.name}', {batch_id}, {i});"
            cursor.execute(query)

        db.commit()
        cursor.close()
        return Result.Ok(None)

    pass


class SQLType(Enum):
    TINYINT = 1
    BOOLEAN = 2
    SMALLINT = 3
    MEDIUMINT = 4
    INT = 5
    BIGINT = 7
    DECIMAL = 8
    FLOAT = 9
    DOUBLE = 10
    BIT = 11

    BINARY = 12
    BLOB = 13
    CHAR = 14
    ENUM = 15
    INET4 = 16
    INET6 = 17
    MEDIUMBLOB = 18
    MEDIUMTEXT = 19
    LONGBLOB = 20
    LONGTEXT = 21
    JSON = 22
    ROW = 23
    TEXT = 24
    TINYBLOB = 25
    TINYTEXT = 26
    VARCHAR = 27
    VARBINARY = 28
    SET = 29
    UUID = 30

    DATE = 31
    TIME = 32
    DATETIME = 33
    TIMESTAMP = 34
    YEAR = 35

    pass


def _quote(s: str) -> str:
    s = s.replace("'", r"\'")
    s = s.replace('"', r"\"")

    return f"'{s}'"


class Column:
    def __init__(
        self,
        name: str,
        type: SQLType,
        pkey: bool = False,
        nnull: bool = True,
        width: int = None,
        auto_inc: bool = None,
        prec: int = None,
        deflt: str = None,
        enum_keys: list[str] = None,
    ):
        self.name = name
        self.type = type
        self.nnull = nnull
        self.pkey = pkey
        self.ref = None
        self.wdth = width
        self.prec = prec
        self.deflt = deflt
        self.enum_keys = enum_keys
        self.auto_inc = auto_inc

    def primary_key(self) -> Column:
        self.pkey = True
        self.nnull = True
        return self

    def notnull(self) -> Column:
        self.nnull = True
        return self

    def nullable(self) -> Column:
        if self.pkey:
            raise AssertionError("Primary key cannot be nullable.")
        self.nnull = False
        return self

    def auto_increment(self) -> Column:
        if self.type not in [
            SQLType.INT,
            SQLType.BIGINT,
            SQLType.SMALLINT,
            SQLType.MEDIUMINT,
        ]:
            raise AssertionError("Auto increment is only available for integer types.")
        self.auto_inc = True
        return self

    def reference(self, table_name: str, column_name: str) -> Column:
        self.ref = (table_name, column_name)
        return self

    def default(self, deflt: str) -> Column:
        self.deflt = deflt
        return self

    def enum(self, keys: list) -> Column:
        if self.type != SQLType.ENUM:
            raise AssertionError("Enum is only available for enum type.")
        self.enum_keys = keys
        return self

    def width(self, wdth: int = None) -> Column:
        self.wdth = wdth
        return self

    def precision(self, prec: int = None) -> Column:
        self.prec = prec
        return self

    def get_type(self) -> str:
        if self.type == SQLType.ENUM:
            return f"{self.type.name}({','.join([f'{_quote(key)}' for key in self.enum_keys])})"

        if self.type == SQLType.DECIMAL:
            if self.prec == None:
                return f"{self.type.name}({self.wdth})"
            elif self.wdth == None:
                return f"{self.type.name}(10, {self.prec})"
            else:
                return f"{self.type.name}({self.wdth}, {self.prec})"

        if self.wdth == None:
            return self.type.name
        else:
            return f"{self.type.name}({self.wdth})"

    def get_default(self) -> str:
        if self.deflt == None:
            return ""
        else:
            return f"DEFAULT {self.deflt}"

    def __str__(self) -> str:
        sql = f"{self.name} {self.get_type()} {'NOT NULL' if self.nnull else 'NULL'} {self.get_default()} {'AUTO_INCREMENT' if self.auto_inc else ''} {'PRIMARY KEY' if self.pkey else ''}"
        return sql

    pass


class Table:
    def __init__(self, name: str):
        self.name = name
        self.columns = []
        self.refs = []
        self.seeds = []

    def column(
        self,
        column_name: str,
        type: SQLType,
        primary_key: bool = False,
        notnull: bool = True,
        width: int = None,
        precision: int = None,
        enum_keys: list[str] = None,
    ) -> Column:
        if any([True for c in self.columns if c.name == column_name]):
            raise AssertionError("There is already a column with the same name.")

        col = Column(
            name=column_name,
            type=type,
            pkey=primary_key,
            nnull=notnull,
            width=width,
            prec=precision,
            enum_keys=enum_keys,
        )
        self.columns.append(col)
        return col

    def foreign_key(
        self,
        column_name: str,
        table_name: str,
        column_name_ref: str,
        _type: SQLType = SQLType.INT,
    ) -> Table:
        if any([True for c in self.columns if c.name == column_name]):
            raise AssertionError("There is already a foreign key with the same name.")

        self.column(column_name, type=_type).reference(table_name, column_name_ref)
        self.refs.append((column_name, table_name, column_name_ref))
        return self

    def migrate(self):
        MigratorQueue.queue.append((self.name, self))

    def is_referencing(self, table: Table) -> bool:
        for ref in self.refs:
            if ref[1] == table.name:
                return True
        return False

    def seed(self, seeds: list[dict]) -> None:
        self.seeds = seeds

    def commit(self, db: msc.MySQLConnection) -> Result[None, str]:
        if not db.is_connected():
            return Result.Err("Database is not connected.")

        cursor = db.cursor()

        sql = f"""CREATE TABLE IF NOT EXISTS {self.name} (
{" , ".join([str(c) for c in self.columns])} {"," if self.refs else ""}

{" , ".join([f"FOREIGN KEY ({ref[0]}) REFERENCES {ref[1]}({ref[2]})" for ref in self.refs])}
);
"""

        print(f"Trying: {sql}")
        try:
            cursor.execute(sql)
        except msc.Error as e:
            return Result.Err(str(e))

        if self.seeds:
            keys = set()
            for d in self.seeds:
                keys = keys.union(set(d.keys()))

            sorted_keys = sorted(keys)

            seed_sql = "INSERT INTO " + self.name + " ("
            seed_sql += ", ".join(sorted_keys)
            seed_sql += ") VALUES "

            values = []
            for d in self.seeds:
                vals = ", ".join(
                    map(
                        lambda x: str(x),
                        [
                            f"'{d.get(k)}'"
                            if type(d.get(k)) is str
                            else f"'{json.dumps(d.get(k))}'"
                            for k in sorted_keys
                        ],
                    )
                )
                vals = vals.replace("None", "NULL")
                values.append("(" + vals + ")")

            seed_sql += ", ".join(values)

            seed_sql += ";"

            print(f"Executing seed: {seed_sql}")

            try:
                cursor.execute(seed_sql)
                cursor.fetchall()
                return Result.Ok(None)
            except msc.Error as e:
                return Result.Err(str(e))
        else:
            return Result.Ok(None)

    def drop(self, db: msc.MySQLConnection) -> Result[None, str]:
        if not db.is_connected():
            return Result.Err("Database is not connected.")

        cursor = db.cursor()

        sql = f"DROP TABLE IF EXISTS {self.name};"

        try:
            cursor.execute(sql)
            return Result.Ok(None)
        except msc.Error as e:
            return Result.Err(str(e))

    # types shorts # cspell: disable-line

    def int(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.INT)

    def float(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.FLOAT)

    def decimal(
        self, column_name: str, width: int = None, precision: int = None
    ) -> Column:
        return self.column(
            column_name=column_name,
            type=SQLType.DECIMAL,
            width=width,
            precision=precision,
        )

    def boolean(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.BOOLEAN)

    def text(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.TEXT)

    def mediumtext(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.MEDIUMTEXT)

    def varchar(self, column_name: str, width: int = None) -> Column:
        return self.column(column_name=column_name, type=SQLType.VARCHAR, width=width)

    def varbinary(self, column_name: str, width: int = None) -> Column:
        return self.column(column_name=column_name, type=SQLType.VARBINARY, width=width)

    def json(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.JSON)

    def enum(self, column_name: str, *enum_keys) -> Column:
        return self.column(
            column_name=column_name, type=SQLType.ENUM, enum_keys=list(enum_keys)
        )

    def date(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.DATE)

    def time(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.TIME)

    def datetime(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.DATETIME)

    def timestamp(self, column_name: str) -> Column:
        return self.column(column_name=column_name, type=SQLType.TIMESTAMP)
