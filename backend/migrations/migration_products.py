from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "products"

def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key().auto_increment()
    table.varchar("pid", 43)
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
    return table
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)

# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    return [
        {
            "pid": "McuxrwGHJqnlyD-QrsyzpS_YoEnS3VxWic7GPLAm-wM",
            "name": "TRAXXAS 1/10 4X4 Monster Truck",
            "images": "{\"images\": [\"https://placehold.co/600x400\"]}",
            "catId": "1",
            "owner": "1",
            "price": "1000.00",
            "customization": "{}",
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup"
        }
    ]
