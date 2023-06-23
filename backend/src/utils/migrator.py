import os
import re
from argparse import ArgumentParser
from importlib import import_module

import mysql.connector as msc
from dotenv import load_dotenv
from rich.console import Console

from backend.src.utils.reserved.reserved_keywords import RESERVED
from backend.src.utils.table import MigratorQueue

console = Console()


def is_digits(s: str) -> bool:
    m = re.match(r"\d+", s)
    if m is None:
        return False
    return m.groups(0) == s


def create_migration_file(table_name: str):
    if len(table_name) > 32:
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        exit(1)

    if any(x in table_name for x in ["$", " ", "/", "."]):
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        exit(1)

    if is_digits(table_name):
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        exit(1)

    if table_name in RESERVED:
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        exit(1)

    filename = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "migrations",
        "migration_" + table_name + ".py",
    )

    content = f"""from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "{table_name}"

def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key().auto_increment()

    table.migrate() # always finish with a call to table.migrate()
    return table
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)

# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    pass
"""

    with open(filename, "w") as f:
        f.write(content)

    console.print("[green]Created migration file.[/green]")


def rollback_database(db_conn: msc.MySQLConnection) -> None:
    try:
        cursor = db_conn.cursor(prepared=True)
        query = "SELECT m.id, m.name, m.table_name, m.batch_id, m.order_id FROM migrations_log as m INNER JOIN ( SELECT MAX(batch_id) as max_batch_id FROM migrations_log ) as max_m ON m.batch_id = max_m.max_batch_id;"
        cursor.execute(query)
        result = cursor.fetchall()

        rollbacks = sorted(result, key=lambda x: x[4], reverse=True)

        for rollback in rollbacks:
            console.print(f"[green]Rolling back {rollback[2]}[/green]")
            service = import_module(f"backend.migrations.{rollback[1]}")
            service.down(db_conn)
            rmquery = "DELETE FROM migrations_log WHERE id = %s"
            cursor.execute(rmquery, (rollback[0],))
            cursor.fetchall()

        cursor.close()
        db_conn.commit()

        console.print("[green]Rolled back database.[/green]")
    except Exception as e:
        console.print("[red]Failed to rollback database.[/red]")
        console.print_exception()
        exit(1)


def migrate_database(db_conn: msc.MySQLConnection) -> None:
    # get all migration files
    migrations = os.listdir(
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations"
        )
    )
    # names = []
    try:
        for migration in migrations:
            if migration.endswith(".py"):
                service = import_module(f"backend.migrations.{migration[:-3]}")
                # names.append(service.TABLE_NAME)
                table = service.up()
                if "seed" in dir(service) and service.seed() is not None:
                    seed = service.seed()
                    table.seed(seed)
    except Exception as e:
        console.print("[red]Failed to migrate database.[/red]")
        console.print_exception()
        exit(1)

    result = MigratorQueue.commit(db_conn)
    if result.is_err():
        console.print("[red]Failed to migrate database.[/red]")
        console.print(f"Why: {result.unwrap_err()}")
        exit(1)

    console.print("[green]Migrated database.[/green]")


def flush_database(db_conn: msc.MySQLConnection) -> None:
    try:
        # drop the entire database
        cursor = db_conn.cursor(prepared=True)
        cursor.execute("DROP DATABASE IF EXISTS " + os.getenv("DB_NAME"))
        cursor.execute("CREATE DATABASE " + os.getenv("DB_NAME"))
        cursor.close()
        db_conn.commit()

        console.print("[green]Flushed database.[/green]")
    except Exception as e:
        console.print("[red]Failed to flush database.[/red]")
        console.print_exception()
        exit(1)


def main() -> None:
    if not os.path.exists(
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations"
        )
    ):
        os.mkdir(
            os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "migrations",
            )
        )

    ap = ArgumentParser(description="Python database migrator.")
    ap.add_argument("-n", "--new", action="store", help="create a new migration file")
    ap.add_argument("-r", "--rollback", action="store_true", help="drop the database")
    ap.add_argument("-f", "--flush", action="store_true", help="recreate the database")
    ap.add_argument("-t", "--test", action="store", help="test the database")

    args = vars(ap.parse_args())

    if args["test"]:
        dsn = args["test"]
        pattern = r"HOST=([a-zA-Z0-9.-_]+);PORT=([\d]+);DB=([a-zA-Z0-9.-_]+);USER=([a-zA-Z0-9.-_]+);PWD=([a-zA-Z0-9.-_]*)"
        mch = re.search(pattern, string=dsn)
        if mch is None:
            console.print("[red]Invalid DSN.[/red]")
            exit(code=1)

        host = mch.group(1)
        port = mch.group(2)
        db = mch.group(3)
        user = mch.group(4)
        pwd = mch.group(5)

        os.environ["DB_HOST"] = host
        os.environ["DB_PORT"] = str(port)
        os.environ["DB_NAME"] = db
        os.environ["DB_USER"] = user

        if pwd != "":
            os.environ["DB_PASS"] = pwd
    else:
        load_dotenv(dotenv_path=".env.local")

    try:
        db_conn = msc.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            passwd=os.getenv("DB_PASS"),
            db=os.getenv("DB_NAME"),
        )
    except Exception as e:
        console.print(
            "[red]Failed to create a database connection, not even trying.[/red]"
        )
        console.print_exception()
        exit(1)

    if args["new"]:
        create_migration_file(args.get("new").lower())
        exit(0)

    if args["flush"]:
        flush_database(db_conn)
        exit(0)

    if args["rollback"]:
        rollback_database(db_conn)
        exit(0)

    migrate_database(db_conn)
    exit(0)


if __name__ == "__main__":
    main()
