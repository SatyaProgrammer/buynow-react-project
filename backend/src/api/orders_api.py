import json
from flask import Blueprint, request

from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter
from backend.src.lib.validate import validate_verified

orders_api = Blueprint("orders_api", __name__)


@orders_api.get("/trackings")
@token_required
@limiter.limit("10/minute")
def get_trackings(uid):
    try:
        db_conn = Global.db_conn

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute(
            "SELECT id, userId, createdAt FROM trackings WHERE userId = ?", (uid,)
        )
        trackings = cursor.fetchall()
        cursor.close()

        return {"trackings": trackings}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@orders_api.post("/trackings")
@token_required
@limiter.limit("10/minute")
def create_tracking(uid):
    try:
        db_conn = Global.db_conn
        if not validate_verified(db_conn, uid):
            return (
                {"error_code": "BX0002", "error": "Not verified."},
                403,
                {"Content-Type": "application/json"},
            )

        order_data = request.get_json()
        orders = order_data["orders"]

        # create tracking number
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("INSERT INTO trackings (userId) VALUES (?)", (uid,))
        tracking_id = cursor.lastrowid
        print(f"tracking id = {tracking_id}")

        if tracking_id is None:
            return (
                {"error_code": "BX0000", "error": "Something went wrong."},
                500,
                {"Content-Type": "application/json"},
            )

        id_pairs = []

        for order in orders:
            cursor = db_conn.cursor(prepared=True, dictionary=True)
            pid = order["pid"]

            cursor.execute(
                "SELECT id, availability, owner FROM products WHERE pid = ?", (pid,)
            )
            item = cursor.fetchone()
            iid = item["id"]
            stock = item["availability"]
            owner = item["owner"]

            if owner == uid:
                return (
                    {
                        "error_code": "BX0101",
                        "error": "You cannot order your own product.",
                    },
                    400,
                    {"Content-Type": "application/json"},
                )

            if stock < order["quantity"]:
                return (
                    {"error_code": "BX0102", "error": "Insufficient stock."},
                    400,
                    {"Content-Type": "application/json"},
                )

            id_pairs.append((iid, order["quantity"]))
            print(f"iid = {iid}, quantity = {order['quantity']}")

        for item in id_pairs:
            i_id, i_quantity = item
            print(f"{i_id=}, {i_quantity=}")
            cursor = db_conn.cursor(prepared=True)

            cursor.execute(
                "UPDATE products SET availability = availability - ? WHERE id = ?",
                (i_quantity, i_id),
            )

            cursor = db_conn.cursor(prepared=True)
            cursor.execute("SELECT price FROM products WHERE id = ?", (i_id,))
            price = cursor.fetchone()[0]

            cursor = db_conn.cursor(prepared=True)
            cost = price * i_quantity
            cursor.execute(
                "INSERT INTO orders (trackingNumber, productId, quantity, cost, status) VALUES (?, ?, ?, ?, 'pending')",
                (tracking_id, i_id, i_quantity, cost),
            )

        db_conn.commit()

        return {"message": "Order created."}, 201, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@orders_api.get("/trackings/<tracking_number>")
@token_required
@limiter.limit("10/minute")
def get_order(uid, tracking_number):
    try:
        db_conn = Global.db_conn

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT userId FROM trackings WHERE id = ?", (tracking_number,))
        tracking = cursor.fetchone()
        cursor.close()

        if tracking is None:
            return (
                {"error_code": "BX0101", "error": "Order not found."},
                404,
                {"Content-Type": "application/json"},
            )

        # Only the buyer can view the entire tracking list
        # Seller can only view the orders that are related to his/her products

        if tracking["userId"] == uid:
            cursor = db_conn.cursor(prepared=True, dictionary=True)
            cursor.execute(
                """SELECT o.id, o.trackingNumber, o.status, p.pid, p.name,
p.images, o.customization, o.quantity, o.cost
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE trackingNumber = ?""",
                (tracking_number,),
            )

            orders = cursor.fetchall()
            cursor.close()

            if orders is None:
                return (
                    {"error_code": "BX0101", "error": "Order not found."},
                    404,
                    {"Content-Type": "application/json"},
                )

            for order in orders:
                order["images"] = json.loads(order["images"])

            return {"orders": orders}, 200, {"Content-Type": "application/json"}
        else:
            cursor = db_conn.cursor(prepared=True, dictionary=True)
            cursor.execute(
                """SELECT o.id, o.trackingNumber, o.status p.pid, p.name,
p.images, o.customization, o.quantity, o.cost
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
WHERE trackingNumber = ? AND p.owner = ?""",
                (tracking_number, uid),
            )

            orders = cursor.fetchall()
            cursor.close()

            if orders is None:
                return (
                    {"error_code": "BX0101", "error": "Order not found."},
                    404,
                    {"Content-Type": "application/json"},
                )

            for order in orders:
                order["images"] = json.loads(order["images"])

            for order in orders:
                order["images"] = json.loads(order["images"])

            return {"orders": orders}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@orders_api.post("/trackings/<order_id>")
@token_required
@limiter.limit("10/minute")
def update_order_status(uid, order_id):
    try:
        data = request.get_json()
        status = data["status"]

        db_conn = Global.db_conn

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = """\
SELECT o.id, p.owner
FROM orders as o
INNER JOIN products as p ON o.productId = p.id
WHERE o.id = ?"""

        cursor.execute(sql, (order_id,))
        order = cursor.fetchone()

        if order is None:
            return (
                {"error_code": "BX0101", "error": "Order not found."},
                404,
                {"Content-Type": "application/json"},
            )

        if order["owner"] != uid:
            return (
                {"error_code": "BX0103", "error": "Unauthorized."},
                401,
                {"Content-Type": "application/json"},
            )

        if status not in ["pending", "delivering", "failed", "completed"]:
            return (
                {"error_code": "BX0102", "error": "Invalid status."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        db_conn.commit()

        return {"message": "Order updated."}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {
                "error_code": "BX0000",
                "error": "Something went wrong.",
            },
            500,
            {"Content-Type": "application/json"},
        )


@orders_api.get("/trackings/vendor")
@limiter.limit("10/minute")
@token_required
# get all orders that are related to the vendor's products
def get_orders_from_vendor(uid):
    try:
        db_conn = Global.db_conn

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute(
            """\
SELECT o.trackingNumber, t.userId, u.username, p.pid, p.name, p.images, o.customization, o.quantity, o.cost, o.status
FROM orders as o
INNER JOIN trackings as t ON o.trackingNumber = t.id
INNER JOIN users as u ON t.userId = u.id
INNER JOIN products as p ON o.productId = p.id
WHERE p.owner = ?""",
            (uid,),
        )

        orders = cursor.fetchall()
        cursor.close()

        if orders is None:
            return (
                {"error_code": "BX0101", "error": "Order not found."},
                404,
                {"Content-Type": "application/json"},
            )

        for order in orders:
            order["images"] = json.loads(order["images"])

        return {"orders": orders}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )
