from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "usersv2"

def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key()
    table.varchar("username", width=255)
    table.varchar("email", width=320)
    table.varchar("password", width=128)
    table.varchar("salt", width=32)
    table.boolean("verified")
    table.enum("userType", "customer", "vendor", "administrator")
    table.timestamp("createdAt").default("CURRENT_TIMESTAMP")
    
    table.migrate()
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)
