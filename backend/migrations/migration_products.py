import mysql.connector as msc

from backend.src.utils.table import Table

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
    table.int("soldAmount").default("0")
    table.text("deliveryOption")
    table.boolean("deleted").default("0")
    table.timestamp("createdAt").default("CURRENT_TIMESTAMP")

    table.migrate()  # always finish with a call to table.migrate()
    return table


def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)


# if you need to seed the database
def seed() -> list[dict]:
    # just return a list of key-value pairs
    return [
        {
            "pid": "KZv-fzSI5JTgMKiv2L6KpT5-dzsgXoDHAZFRpzfRGfc",
            "name": "accent chair",
            "images": '{"images": ["https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681749482/react-comfy-store-products/iuYyO9RP_o_upinxq.jpg"]}',
            "catId": "2",
            "owner": "2",
            "price": "25999",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "8",
            "deliveryOption": "Meetup",
        },
    ]
