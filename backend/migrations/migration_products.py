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
    table.int("soldAmount").default("0")
    table.text("deliveryOption")
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
            "pid": "McuxrwGHJqnlyD-QrsyzpS_YoEnS3VxWic7GPLAm-wM",
            "name": "TRAXXAS 1/10 4X4 Monster Truck",
            "images": '{"images": ["https://placehold.co/600x400"]}',
            "catId": "1",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "KZv-fzSI5JTgMKiv2L6KpT5-dzsgXoDHAZFRpzfRGfc",
            "name": "accent chair",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681749482/react-comfy-store-products/iuYyO9RP_o_upinxq.jpg"]}',
            "catId": "2",
            "owner": "1",
            "price": "25999",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "8",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "0t-BUg9eswbMIxxk2-PvuXEzeSe7VJP80U132JkuLF0",
            "name": "albany sectional",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681750874/react-comfy-store-products/product-3_znpiqa.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681750929/react-comfy-store-products/product-4_ebl6q1.jpg"]}',
            "catId": "3",
            "owner": "1",
            "price": "109999",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "2",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "5",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "5VtiUAmHGNNoyvxX2ki44Uk9S87uq9fR9TOedseW6FQ",
            "name": "armchair",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg" ]}',
            "catId": "4",
            "owner": "1",
            "price": "42999",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "3.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "3",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "Oe3rEp2-8lHuW7LcVwlp0-ZgCgDa32bG9ZiPfxrdP6M",
            "name": "entertainment center",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg"]}',
            "catId": "5",
            "owner": "1",
            "price": "8000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "3eIUZ2DpEqhjofCCuxAr3m86uLZC0P8S30U1pT9fkVg",
            "name": "high-back bench",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681753280/react-comfy-store-products/prod-7_ta21yy.jpg"]}',
            "catId": "6",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "x-0_jP22txO5H71RapBXx_allThjot6YGgiQ6HlirBE",
            "name": "leather chair",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681753280/react-comfy-store-products/prod-7_ta21yy.jpg"]}',
            "catId": "1",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "6XRoFVxWrz2t_2B6wcINfh6x7AJtcYKCjFS8-_pUv2E",
            "name": "leather sofa",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681753280/react-comfy-store-products/prod-7_ta21yy.jpg"]}',
            "catId": "2",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "SwFgIUBo8x-z0fFB1T4QMDu-ioWd1DpTjmy1zYuMdMA",
            "name": "modern bookshelf",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681753280/react-comfy-store-products/prod-7_ta21yy.jpg"]}',
            "catId": "3",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "M6M_NZSuazW0vI-qb2rqj-DeQXEuGR04gSo-sLDDcEw",
            "name": "modern poster",
            "images": '{"images": ["https://placehold.co/600x400", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681751026/react-comfy-store-products/product-5_n184nu.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681752461/react-comfy-store-products/product-6_rhaxfo.jpg", "https://res.cloudinary.com/dt2g7mgtv/image/upload/v1681753280/react-comfy-store-products/prod-7_ta21yy.jpg"]}',
            "catId": "4",
            "owner": "1",
            "price": "1000.00",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "4.5",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl ultricies nunc, vitae aliquam nisl nisl vitae n",
            "availability": "10",
            "deliveryOption": "Meetup",
        },
    ]
