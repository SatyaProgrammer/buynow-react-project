import mysql.connector as msc

from backend.src.utils.table import Table

# don't change this variable name
TABLE_NAME = "userscustomization"


def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key().auto_increment()
    table.foreign_key("recipientId", "users", "id")
    table.enum("theme", "light", "dark").default("light")
    table.varchar("image", 280).nullable()
    table.json("contactInfo").default(r"'{}'")

    table.migrate()  # always finish with a call to table.migrate()
    return table


def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)


# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    pass
