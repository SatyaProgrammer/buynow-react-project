from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "reports"

def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key().auto_increment()
    table.foreign_key("productId", "products", "id")
    table.text("reason")

    table.migrate() # always finish with a call to table.migrate()
    return table
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)

# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    pass
