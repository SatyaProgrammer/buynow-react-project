from backend.src.lib import Global
from backend.src.models.model import Model

class Category(Model):
    @classmethod
    def fetch_matching(cls, __taking: list[str], __cond: dict[str, str]) -> list[dict[str]]:
        taking = list(__taking)
        db_conn = Global.db_conn
        
        sb = "SELECT "
        if len(taking) == 0:
            sb += "* "
        else:
            sb += ", ".join(taking)
        
        sb += " FROM categories WHERE "
        sb += " AND ".join([f"{key} = %s" for key in __cond.keys()])
        
        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb, tuple(__cond.values()))
        
        result = cursor.fetchall()
        cursor.close()
        
        res = [Category.__result_to_dict(result[i], taking) for i in range(len(result))]
        
        return res
    
    @classmethod
    def fetch_all(cls, __taking: list[str]) -> list[dict[str]]:
        taking = list(__taking)
        db_conn = Global.db_conn
        
        sb = "SELECT "
        if len(taking) == 0:
            sb += "* "
        else:
            sb += ", ".join(taking)
        
        sb += " FROM categories"
        
        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb)
        
        result = cursor.fetchall()
        cursor.close()
        
        res = [Category.__result_to_dict(result[i], taking) for i in range(len(result))]
        return res

    @classmethod
    def id(cls, __id: str | int) -> dict[str]:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        cursor.execute("SELECT * FROM categories WHERE id = %s", (__id,))
        result = cursor.fetchone()
        cursor.close()
        return Category.__result_to_dict(result)

    @staticmethod
    def __result_to_dict(result: tuple, taking: list[str] = None) -> dict[str]:
        if result is None:
            return {}
        
        if not taking:
            return {
                "id": result[0],
                "name": result[1],
            }
        else:
            return {
                key: result[i]
                for i, key in enumerate(taking)
            }