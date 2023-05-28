from flask import Blueprint, request
from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

orders_api = Blueprint("orders_api", __name__)


@orders_api.get("/trackings")
@token_required
@limiter.limit("10/minute")
def get_trackings(uid):
    try:
        db_conn = Global.db_conn

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT id, status FROM trackings WHERE userId = ?", (uid,))
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
        order_data = request.get_json()
        orders = order_data["orders"]

        # create tracking number
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute(
            "INSERT INTO trackings (status, userId) VALUES ('pending', ?)", (uid,)
        )
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
                "SELECT id, availability FROM products WHERE pid = ?", (pid,)
            )
            item = cursor.fetchone()
            iid = item["id"]
            stock = item["availability"]

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
                "INSERT INTO orders (trackingNumber, productId, quantity, cost) VALUES (?, ?, ?, ?)",
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
                """SELECT o.trackingNumber, p.pid, p.name,
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

            return {"orders": orders}, 200, {"Content-Type": "application/json"}
        else:
            cursor = db_conn.cursor(prepared=True, dictionary=True)
            cursor.execute(
                """SELECT o.trackingNumber, p.pid, p.name,
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

            return {"orders": orders}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@orders_api.post("/trackings/<tracking_number>")
@token_required
@limiter.limit("10/minute")
def update_order_status(uid, tracking_number):
    try:
        db_conn = Global.db_conn
        order_data = request.get_json()
        status = order_data["status"]

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM trackings WHERE id = ?", (tracking_number,))
        tracking = cursor.fetchone()
        cursor.close()

        if tracking is None:
            return (
                {"error_code": "BX0101", "error": "Order not found."},
                404,
                {"Content-Type": "application/json"},
            )

        # Only the admin can update the order status
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT admin FROM users WHERE id = ?", (uid,))
        user = cursor.fetchone()
        cursor.close()

        if user is None or user["admin"] == 0:
            return (
                {"error_code": "BX0103", "error": "Unauthorized."},
                401,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute(
            "UPDATE trackings SET status = ? WHERE id = ?", (status, tracking_number)
        )
        cursor.close()

        db_conn.commit()

        return (
            {"message": "Order status updated."},
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
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
SELECT o.trackingNumber, p.pid, p.name, p.images, o.customization, o.quantity, o.cost
FROM orders as o
INNER JOIN products as p
ON o.productId = p.id
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

        return {"orders": orders}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )
