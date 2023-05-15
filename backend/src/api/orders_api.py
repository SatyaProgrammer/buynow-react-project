from flask import Blueprint, request
from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

orders_api = Blueprint("orders_api", __name__)

@orders_api.get("/orders")
@token_required
@limiter.limit("10/minute")
def get_orders(uid):
    try:
        db_conn = Global.db_conn
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE userId = ?", (uid,))
        orders = cursor.fetchall()
        cursor.close()
        
        return {
            "orders": orders
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}