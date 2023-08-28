import mysql.connector as msc

from backend.src.utils.table import Table

# don't change this variable name
TABLE_NAME = "users"


def up():
    table = Table(name=TABLE_NAME)
    table.int("id").primary_key().auto_increment()
    table.varchar("username", width=255)
    table.varchar("email", width=320)
    table.varchar("password", width=128).nullable()
    table.varchar("salt", width=32).nullable()
    table.boolean("verified")
    table.boolean("admin")
    table.timestamp("createdAt").default("CURRENT_TIMESTAMP")

    table.migrate()
    return table


def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)


def seed() -> list[dict]:
    return [
        {
            # password is "hakurei"
            "username": "reimu",
            "email": "ikasakimatou@gmail.com",
            "password": "67862050521e6ea8b8b9a1c6258568b57e77663d86425f45acc8c4c0e8cf75882c8d297afcd0f9aeecc8ac68a0575dca1e2fcdb6be9355f8d633d607314c0647",  # cspell: disable-line
            "salt": "IeQrVMC1or06wxm48gJjBx3KxKnNwmkA",  # cspell: disable-line
            "verified": 1,
            "admin": 1,
        },
        {
            # password is "null"
            "username": "kaze",
            "email": "teng.thaisothyrak@gmail.com",
            "password": "e55409ff3f9e4c3a8cebb5400e9cca20fffb8a5e4c0bee374e8f712adea63d07e5bd7e63f022282df36b26c46f5eb015d79c13efd22e3a003910b8440aa107f3",  # cspell: disable-line
            "salt": "Myg0FpvDRYIBW3bNpkUivR9iFByD41S5",  # cspell: disable-line
            "verified": 1,
            "admin": 0,
        },
        {
            # password is "123"
            "username": "sakuya",
            "email": "noraimaisumireko@gmail.com",
            "password": "73ee1cf863b21487d5a1d06ec5c6551325435711e21599c8856e0e65514016c56e44c50b02ec223a6db0c84a84e204707ce3bad6e9097026de4573e74d889d92",  # cspell: disable-line
            "salt": "69aX37exx2PKs0IH8iXz7KN7mZBO76Bg",  # cspell: disable-line
            "verified": 0,
            "admin": 0,
        },
    ]
