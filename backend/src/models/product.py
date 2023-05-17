from json import loads
from backend.src.lib import Global
from backend.src.models.model import Model
from backend.src.models.user import User
from backend.src.models.category import Category
from backend.src.lib import Result

class Product(Model):
    @classmethod
    def fetch_matching(cls, __taking: list[str], __cond: dict[str, str], offset: int = 0, limit: int = 25, sort_newest: bool = False) -> list[dict[str]]:
        taking = list(__taking)
        db_conn = Global.db_conn
        
        if len(taking) == 0:
            sb = f"""SELECT p.id, p.pid, p.name, p.images, c.name as catName,
u.username as ownerName, p.price, p.customization, p.rating, p.availability, p.soldAmount,
p.deliveryOption, p.description, p.createdAt FROM products AS p
INNER JOIN categories AS c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id
WHERE {" AND ".join([f"{'c' if k == 'catName' else 'u' if k == 'username' else 'p'}.{k} {Product.__tsl(__cond[k][0])}" for k in __cond.keys()])}
{"ORDER BY p.createdAt DESC" if sort_newest else ""}
{"LIMIT %s OFFSET %s" if limit != -1 else ""}"""
        else:
            sb = "SELECT "
            sb += ", ".join(taking)
            sb += " FROM products"
            sb += " INNER JOIN categories AS c ON p.catId = c.id"
            sb += " INNER JOIN users as u ON p.owner = u.id"
            sb += " WHERE "
            sb += " AND ".join([f"{k} = %s" for k in __cond.keys()])
            if sort_newest: sb += " ORDER BY p.createdAt DESC"
            if limit != -1: sb += " LIMIT %s OFFSET %s"
            
        print(sb)
        
        cursor = db_conn.cursor(prepared=True)
        print(tuple(map(lambda x: x[1: ], tuple(__cond.values()))) + (limit, offset) if limit != -1 else tuple(map(lambda x: x[1:], tuple(__cond.values()))))
        cursor.execute(sb, tuple(map(lambda x: x[1: ] if x[0] != "m" else f"%{x[1:]}%", tuple(__cond.values()))) + (limit, offset) if limit != -1 else tuple(map(lambda x: x[1:] if x[0] != "m" else f"%{x[1:]}%", tuple(__cond.values()))))

        result = cursor.fetchall()
        cursor.close()
        
        res = [Product.__result_to_dict(result[i], taking) for i in range(len(result))]
        
        return res
    
    @classmethod
    def fetch_all(cls, __taking: list[str]) -> list[dict[str]]:
        taking = list(__taking)
        db_conn = Global.db_conn
        
        if len(taking) == 0:
            sb = """SELECT p.id, p.pid, p.name, p.images, c.name as catName,
u.username as ownerName, p.price, p.customization, p.rating, p.availability, p.soldAmount,
p.deliveryOption, p.description, p.createdAt FROM products AS p
INNER JOIN categories AS c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id"""
        else:
            sb = "SELECT "
            sb += ", ".join(taking)
        
        sb += "FROM products"
        
        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb)
        
        result = cursor.fetchall()
        cursor.close()
        
        res = [Product.__result_to_dict(result[i], taking) for i in range(len(result))]
        return res
    
    @staticmethod
    def fetch_newest(__taking: list[str], offset: int = 0, limit: int = 25) -> list[dict[str]]:
        taking = list(__taking)
        db_conn = Global.db_conn
        
        if len(taking) == 0:
            sb = """SELECT p.id, p.pid, p.name, p.images, c.name as catName,
u.username as ownerName, p.price, p.customization, p.rating, p.availability, p.soldAmount,
p.deliveryOption, p.description, p.createdAt FROM products AS p
INNER JOIN categories AS c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id
ORDER BY p.createdAt DESC
LIMIT %s OFFSET %s"""
        else:
            sb = "SELECT "
            sb += ", ".join(taking)
            sb += " FROM products ORDER BY createdAt DESC LIMIT %s OFFSET %s"
            
        cursor = db_conn.cursor(prepared=True)
        cursor.execute(sb, (limit, offset))
        
        result = cursor.fetchall()
        cursor.close()
        
        res = [Product.__result_to_dict(result[i], taking) for i in range(len(result))]
        return res

    @classmethod
    def id(cls, __id: str | int) -> dict[str]:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        sql = """SELECT p.id, p.pid, p.name, p.images, c.name as catName,
u.username as ownerName, p.price, p.customization, p.rating, p.availability, p.soldAmount,
p.deliveryOption, p.description, p.createdAt FROM products AS p
INNER JOIN categories AS c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id
WHERE p.id = %s"""
        result = cursor.fetchone()
        cursor.close()
        
        if result is None:
            return None
        
        return Product.__result_to_dict(result)
    
    @classmethod
    def pid(cls, __pid: str) -> dict[str]:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        sql = """SELECT p.id, p.pid, p.name, p.images, c.name as catName,
u.username as ownerName, p.price, p.customization, p.rating, p.availability, p.soldAmount,
p.deliveryOption, p.description, p.createdAt FROM products AS p
INNER JOIN categories AS c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id
WHERE p.pid = %s"""
        result = cursor.fetchone()
        cursor.close()
        
        if result is None:
            return None
        
        return Product.__result_to_dict(result)
    
    @staticmethod
    def __result_to_dict(__result: tuple, __taking: list[str] = None) -> dict[str]:
        if __result is None:
            return {}
    
        if not __taking:
            taking = [
                "id",
                "pid",
                "name",
                "images",
                "catName",
                "ownerName",
                "price",
                "customization",
                "rating",
                "availability",
                "soldAmount",
                "deliveryOption",
                "description",
                "createdAt"
            ]
            
        res = {taking[i]: __result[i] for i in range(len(taking))}
    
        if "images" in taking:
            res["images"] = loads(res["images"])
        
        if "customization" in taking:
            res["customization"] = loads(res["customization"])

        return res
    
    @staticmethod
    def add(keys: dict[str]) -> Result[tuple, str]:
        try:
            keys_keys = sorted(keys)
            
            sb = "INSERT INTO products ("
            sb += ", ".join(keys_keys)
            sb += ") VALUES ("
            sb += ", ".join(["%s" for _ in range(len(keys_keys))])
            sb += ")"
            
            db_conn = Global.db_conn
            cursor = db_conn.cursor(prepared=True)
            cursor.execute(sb, tuple([keys[key] for key in keys_keys]))
            db_conn.commit()
            cursor.close()
            return Result.Ok(())
        except Exception as e:
            Global.console.print_exception()
            return Result.Err(str(e))
    
    @staticmethod
    def attest_nonexistent(pid: str) -> bool:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        cursor.execute("SELECT COUNT(*) FROM products WHERE pid = %s", (pid,))
        result = cursor.fetchone()
        cursor.close()
        
        return result[0] == 0
    
    @staticmethod
    def __tsl(st: str) -> str:
        if st == "m":
            return r"LIKE %s"
        else:
            return f"{st[0]} %s"