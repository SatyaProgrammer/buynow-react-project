import json
from flask import Blueprint, request

from backend.src.lib import Global, give_connection
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

dashboard_api = Blueprint("dashboard_api", __name__)


@dashboard_api.get("/dashboard/orders_count")
@limiter.limit("2/second")
@token_required
@give_connection
def get_orders_count(db_conn, uid):
    try:
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
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@dashboard_api.get("/dashboard/revenue")
@limiter.limit("2/second")
@token_required
@give_connection
def get_revenue(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT SUM(o.cost) as revenue
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE p.owner = ?;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()
        return (
            {"revenue": result["revenue"] if result["revenue"] is not None else 0},
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@dashboard_api.get("/dashboard/customers")
@limiter.limit("2/second")
@token_required
@give_connection
def get_customers(db_conn, uid):
    try:
        # get total customers
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT COUNT(*) as total_count, COUNT(DISTINCT t.userId) as unique_count
FROM trackings as t
LEFT JOIN orders as o ON t.id = o.trackingNumber
LEFT JOIN products as p ON o.productId = p.id
WHERE p.owner = ?;"""

        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()

        return (
            {
                "total_customers": result["total_count"],
                "unique_customers": result["unique_count"],
            },
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@dashboard_api.get("/dashboard/recent_orders")
@limiter.limit("2/second")
@token_required
@give_connection
def get_recent_orders(db_conn, uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """SELECT o.trackingNumber, t.userId, u.username, o.productId, p.name, p.images, o.customization, o.quantity, o.cost, o.status
FROM orders as o
INNER JOIN trackings as t ON o.trackingNumber = t.id
INNER JOIN users as u ON t.userId = u.id
INNER JOIN products as p ON o.productId = p.id
WHERE p.owner = ?
ORDER BY o.createdAt DESC
LIMIT 20;"""
        cursor.execute(query, (uid,))
        result = cursor.fetchall()

        for order in result:
            order["images"] = json.loads(order["images"])
        cursor.close()
        return {"orders": result}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )
