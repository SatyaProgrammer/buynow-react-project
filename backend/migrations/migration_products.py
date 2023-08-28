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
            "description": "This stunning chair boasts a perfect blend of comfort and sophistication, making it an ideal addition to your living room, bedroom, or office. ",
            "availability": "8",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "fH7LVpu0ZUBGUpkxR1CndjRhhJcDJJHlrgnuVK37dFE",
            "name": "Wireless Earbuds",
            "images": '{"images": ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2F3?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1634663474000"]}',
            "catId": "2",
            "owner": "2",
            "price": "199",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "High-quality, Bluetooth-enabled earbuds with noise cancellation.",
            "availability": "8",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "X2-Khfwj6t07Q1YocMixWDZdnoY2RI_q2B8AQjNUAWk",
            "name": "Fitness Tracker",
            "images": '{"images": ["https://media.wired.com/photos/61b26233c2f5f4d2aaf1c2b5/master/w_2580,c_limit/Gear-Fitbit-Charge-5.jpg"]}',
            "catId": "2",
            "owner": "2",
            "price": "99",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "A wearable device that tracks steps, heart rate, sleep, and other fitness metrics.",
            "availability": "8",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "lQaNxsvpKg_NR11wII5TC-0ePd3do_Swl36cwGnu1P0",
            "name": "Smart Home Security Camera",
            "images": '{"images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCsJCpLSubNHPPHY2fwGc-NmM1LgnP4FtWcA&usqp=CAU"]}',
            "catId": "2",
            "owner": "2",
            "price": "49",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Wi-Fi enabled camera with motion detection and live streaming capabilities.",
            "availability": "4",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "dRJF1P8pAFeTXAhlpV75A95axAyukHirkMk7rudIAfs",
            "name": "Reusable Water Bottles",
            "images": '{"images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL0Syv9W1g0LGQW0tuIvHp2RGsL12zajDOmA&usqp=CAU"]}',
            "catId": "2",
            "owner": "2",
            "price": "29",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Eco-friendly, BPA-free water bottles in various sizes and designs.",
            "availability": "2",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "gFPvImIXSRuxM7lc1yn9xA9VkXCt2kuDCln-qHvRi6U",
            "name": "Yoga Mats",
            "images": '{"images": ["data:image/jpeg;base64,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"]}',
            "catId": "2",
            "owner": "2",
            "price": "9",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Non-slip, comfortable mats for yoga and other fitness activities.",
            "availability": "22",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "CGbdRT-z0AEYfLHXO_bKtcIrd7QnbL3L4FlADq0K6n0",
            "name": "Laptop Backpacks",
            "images": '{"images": ["data:image/jpeg;base64,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"]}',
            "catId": "2",
            "owner": "2",
            "price": "39",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Stylish and functional backpacks designed specifically for laptops and accessories.",
            "availability": "12",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "xun5EXhsxxF-kUGhHobCWEGcU8cpj5Kq94OigVU0ncQ",
            "name": "Travel Neck Pillows",
            "images": '{"images": ["data:image/jpeg;base64,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"]}',
            "catId": "2",
            "owner": "2",
            "price": "19",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Soft and supportive pillows for comfortable travel and neck support.",
            "availability": "6",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "XjhmIYZWZPwbNZ771L2EY2WtoqGn2ZjtaOkRWmgT2Ek",
            "name": "Insulated Lunch Boxes",
            "images": '{"images": ["data:image/jpeg;base64,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"]}',
            "catId": "2",
            "owner": "2",
            "price": "14",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Thermal lunch containers to keep food fresh and warm/cold.",
            "availability": "6",
            "deliveryOption": "Meetup",
        },
        {
            "pid": "jHI0_YsmhjhlomwUlUnvzJBFva7XGv-0BvtsImZVNYU",
            "name": "LuxeLeather Classic Wallet",
            "images": '{"images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUQEhIWFRAVFxYXFRUYEhcXFRUVGBUZFxcWFRcYHSggGBolHRcXITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0OFQ8PGisgGSA3Ky0tMDcrNysrMisrKysrKysrKystKysrODcrLSsrNy03Ky0rLTcrNystNzctKy03K//AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQIDBwgFBAb/xABCEAEAAQIBBAwLBwMFAAAAAAAAAQIDEQQFIfAGMVFTVGFxdJGSs9EHCBMVMjQ1QVKiwRIWIoGhsdIlgvEUJGKDo//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AN4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8rZXl1djIsqyi3hFy1YvXKJmMYiqi3VVEzHv0wD1RzlmrZ1nO56WW3J/ttx+1D052W5w4Xd+T+Kwb6GhJ2XZw4Zd+T+LHOzDOHDLnRR/EG/xoD745w4Zc+T+KtWzLOHDLnyfx1xQdAjn2dmecOGXMP7e7kV++mcOF3Pl7gdCDnmdm2ceGXPl7kffbOHDLny9wOhxzx99s48MufL3I++2cOGXPl7uMHRA51nZxnHhlz5e5SrZznHhlz5f4g6NHNtWz3OPDLvy9zFX4Qc5+7LLmPJRP70g6XH4zwUbJb2XZFNy/MTetXarVVUUxT9vCmmuKpiNEThXEThhGMe5+zAAAAAAAAAAAeHs7j+m5dzTKexre48XZr7Py3muUdjUDmzY7tPYuy8fY9tPWuqIrr6GCu4V1Pnrq/zr7wZpu9Ov5sdVzXHi16ORgqq1/RWqrXX3AzVXdf175/PprVcYaqmKZBmqua/kibmvKwYpxBn8rrrroVm6w4qzIMs3GObjHMqTIJqrY5lFauIN6eL9P+yynnU9hZbRat8X31LKedT2FptJAAAAAAAAAAAeFs79m5dzTKexre68LZ57My7mmU9jWDm/Y9tPUv6/T9Xl7H9p6V+VHz3Z+uuv+PnrlmuTrrrofPM9wI113dd1Wqfy6fqT+qmOvECKlFsdfojXXX6gjBMonXXXaJBEzrr+SkytioCKlJXlWQYqlVpVBvTxfPUsp51PYWm0mrfF99SyjnU9hZbSQAAAAAAAAAAHg7PvZmXc1yjsanvPz/hAn+mZdzW/2VQOccwbT0conS87Y/Oh9+USo+a5LBVLLdn6sNQK1K1JVmQRM6666EYmKsglWZ1110koxBMypOvemZVxAlWUyiQY5QmQG8/F99SyjnU9hZbRau8X31LKOdVdhZbRQAAAAAAAAAAH5/wg+zMu5rf7Kp+gfn/CD7My7mt/sqgc4Zh2n35Q+DMO0+6/OlR8txhqZbksNQK1IkmVZBGKpijECUTrrrtiMQRMoxJRMgYqzKZVkESgxAb18X31HKOdVdhZbQav8X31HKOdVdhZbQQAAAAAAAAAAH5/wg+zMu5rf7Kp+gfn/CD7My7mt/sqgc4Zi2n2ZTL48xei+rKZUfLWxTK1yphqkCpWZRNSsyC0yjFXExBOKuJBICqZVmQQiZMUSCEYr2rf2tuYiI25nThxYe+eLjXrppp/FMbfoUTpxj4q+Li9/IDfHgFtYZvuT8WUV1f+VqInohslrnwE1TOb7kzpmcorxn/rtNjIAAAAAAAAAADwPCB7My7muUdlU994Oz72Zl3Nco7GoHNuY/RZ8qq0vnzJP4V8rq0yo+e5Uw1StVLHIEyiU4IwAxDBAGJIgEIlbBAKyW6ccap0UxtzMe/c5eL9oWooidM1YRGnj5I4y9VjVhMTFNOiKNMYcXLPvkFcMdM4xTGiIx08mn9ZTRbwj7c7XujdncjX6Y3ppx/FX6MbUR7/APjTroYr1c1TjtRG1HuiNyAb+8A3s6vnFzs7bY7XHgG9nV84udnbbHQAAAAAAAAAAHi7NMnquZvyy3RE1V15NfpppjbmqbVUREcb2lbluJ0TGMA5NzdciiMKpiJ3JVyjKaZn0o6XVdWbLE7dqieWmFfNOT7zb6kA5Om9Tux0q+Vp3Y6XWfmnJ95t9SDzTk+82+pAOTPK0/FHSjy1PxR0utfNVjebfUjuPNVjebfUgHJXlad2OmCbtPxR0utfNdjebfUjuT5rsbzb6kdwOSPK0/FHTCPLU/FHS64812N5t9SO482WN5o6kdwORvLU7sdMHlad2Ol1z5ts71R1I7k+bbO9UdSAclU3aKNP2omvljCjvq/bl2scXqNuao6dM/m65822d6o6kdx5us71R1IWjkavKKZnGao4tMYRG5BFdO7HS66/0Fre6OrCf9Da3ujqwg/FeBXIq7ebYmuMPKXblymJ0T9mYppiZjj+xjHFMP3rHbs00+jTEckYMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q=="]}',
            "catId": "2",
            "owner": "2",
            "price": "14",
            "customization": r'{"color": ["red", "blue"], "size": ["medium", "large"]}',
            "rating": "0",
            "description": "Elevate your everyday style with the LuxeLeather Classic Wallet. Crafted from premium, hand-selected leather, this wallet offers a perfect blend of timeless elegance and functionality. With its sleek design and meticulous craftsmanship, it fits comfortably in your pocket while providing ample space for your cards, cash, and ID.",
            "availability": "6",
            "deliveryOption": "Meetup",
        },
    ]
