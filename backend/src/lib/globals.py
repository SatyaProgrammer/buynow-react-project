import mysql.connector as msc
from expiringdict import ExpiringDict
from mysql.connector import MySQLConnection
from rich.console import Console

from backend.src.lib.refdict import RefreshingDict


class Global:
    db_conn: MySQLConnection = None
    console: Console = None
    tokens: RefreshingDict = RefreshingDict(max_age_seconds=3600)
    verification_map: ExpiringDict = ExpiringDict(
        max_age_seconds=3600 * 6, max_len=1000
    )
    forgot_password_map: ExpiringDict = ExpiringDict(max_age_seconds=3600, max_len=1000)

    def __init__(self):
        raise Exception("Do not attempt to create a Global object.")
