from backend.src.lib import Global, true
from backend.src.lib.db import create_connection
from backend.src.models.model import Model


class User(Model):
    @classmethod
    def fetch_matching(
        cls, __taking: list[str], __cond: dict[str, str]
    ) -> list[dict[str]]:
        taking = list(__taking)
        __db_conn = create_connection()
        if __db_conn.is_err():
            Global.console.print(str(__db_conn.unwrap_err()))
            return []

        db_conn = __db_conn.unwrap()

        sb = "SELECT "
        if len(taking) == 0:
            sb += "* "
        else:
            sb += ", ".join(taking)

        sb += " FROM users WHERE "
        sb += " AND ".join([f"{key} = %s" for key in __cond.keys()])

        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb, tuple(__cond.values()))

        result = cursor.fetchall()
        cursor.close()

        res = [User.__result_to_dict(result[i], taking) for i in range(len(result))]

        return res

    @classmethod
    def fetch_all(cls, __taking: list[str]) -> list[dict[str]]:
        taking = list(__taking)
        __db_conn = create_connection()
        if __db_conn.is_err():
            Global.console.print(str(__db_conn.unwrap_err()))
            return []

        db_conn = __db_conn.unwrap()

        sb = "SELECT "
        if len(taking) == 0:
            sb += "* "
        else:
            sb += ", ".join(taking)

        sb += " FROM users"

        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb)

        result = cursor.fetchall()
        cursor.close()

        res = [User.__result_to_dict(result[i], taking) for i in range(len(result))]
        return res

    @classmethod
    def id(cls, __id: str | int) -> dict[str]:
        __db_conn = create_connection()
        if __db_conn.is_err():
            Global.console.print(str(__db_conn.unwrap_err()))
            return []

        db_conn = __db_conn.unwrap()
        cursor = db_conn.cursor(prepared=True)
        cursor.execute("SELECT * FROM users WHERE id = %s", (__id,))
        result = cursor.fetchone()
        res = User.__result_to_dict(result)
        cursor.close()
        return res

    @staticmethod
    def is_admin(uid: str | int) -> bool:
        uid = int(uid)
        __db_conn = create_connection()
        if __db_conn.is_err():
            Global.console.print(str(__db_conn.unwrap_err()))
            return []

        db_conn = __db_conn.unwrap()
        cursor = db_conn.cursor(prepared=True)
        cursor.execute("SELECT admin FROM users WHERE id = %s", (uid,))
        result = cursor.fetchone()
        cursor.close()
        return true(result[0])

    @staticmethod
    def __result_to_dict(result: tuple, taking: list[str] = None) -> dict[str]:
        if not result:
            return {}
        if not taking:
            return {
                "id": result[0],
                "username": result[1],
                "email": result[2],
                "password": result[3],
                "salt": result[4],
                "verified": true(result[5]),
                "isAdmin": result[6],
                "createdAt": result[7],
            }
        else:
            return {taking[i]: result[i] for i in range(len(taking))}
