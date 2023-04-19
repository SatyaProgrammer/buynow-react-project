from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "products"

def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key()
    table.text("name")
    table.json("images")
    table.foreign_key("catId", "categories", "id")
    table.foreign_key("owner", "users", "id")
    table.decimal("price", precision=2)
    table.json("customization")
    table.float("rating")
    table.mediumtext("description")
    table.int("availability")
    table.int("soldAmount")
    table.text("deliveryOption")
    table.timestamp("createdAt").default("CURRENT_TIMESTAMP")

    table.migrate() # always finish with a call to table.migrate()
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)

# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    pass
