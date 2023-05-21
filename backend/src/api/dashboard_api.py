from flask import Blueprint, request
from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

dashboard_api = Blueprint("dashboard_api", __name__)

@dashboard_api.get('/dashboard/orders_count')
@limiter.limit("2/second")
@token_required
def get_orders_count(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT COUNT(*) as count
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE p.owner = ?;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()
        return {"count": result["count"]}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
    
@dashboard_api.get('/dashboard/revenue')
@limiter.limit("2/second")
@token_required
def get_revenue(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT SUM(o.cost) as revenue
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE p.owner = ?;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()
        return {"revenue": result["revenue"]}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@dashboard_api.get('/dashboard/customers')
@limiter.limit("2/second")
@token_required
def get_customers(uid):
    try:
        # get total and unique customers
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT COUNT(*) as total_customers, COUNT(DISTINCT userId) as unique_customers
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE p.owner = ?;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()
        return {"total_customers": result["total_customers"], "unique_customers": result["unique_customers"]}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@dashboard_api.get('/dashboard/recent_orders')
@limiter.limit("2/second")
@token_required
def get_recent_orders(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT o.trackingNumber, o.productId, p.name, p.images, o.customization, o.quantity, o.cost
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE p.owner = ?
ORDER BY o.createdAt DESC
LIMIT 20;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchall()
        cursor.close()
        return {"orders": result}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
