from flask import Blueprint, request
from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

cust_api = Blueprint('cust_api', __name__)

@cust_api.get('/api/customization')
@token_required
def get_customization(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        sql = """SELECT * FROM userscustomization WHERE uid = %s"""
        cursor.execute(sql, (uid, ))
        result = cursor.fetchone()
        cursor.close()
        
        if result is None:
            # Create a new customization
            cursor = db_conn.cursor(prepared=True)
            sql = """INSERT INTO userscustomization (uid, theme) VALUES (%s, %s)"""
            cursor.execute(sql, (uid, "light"))
            db_conn.commit()
            cursor.close()
            
            return {
                "theme": "light"
            }, 200, {"Content-Type": "application/json"}
        
        return {
            "theme": result[2]
        }, 200, {"Content-Type": "application/json"}
        
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@cust_api.post('/api/customization')
@token_required
@limiter.limit("1/second")
def post_customization(uid):
    try:
        theme = request.json["theme"]
        
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        sql = """UPDATE userscustomization SET theme = %s WHERE uid = %s"""
        cursor.execute(sql, (theme, uid))
        db_conn.commit()
        cursor.close()
        
        return {
            "theme": theme
        }, 200, {"Content-Type": "application/json"}
        
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}