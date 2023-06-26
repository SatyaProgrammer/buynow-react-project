import json

from flask import Blueprint, request

from backend.src.lib import Global, give_connection
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

users_api = Blueprint("users_api", __name__)


@users_api.get("/users")
@limiter.limit("60/minute")
@token_required
@give_connection
def get_users(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = "SELECT admin FROM users WHERE id = ?;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()

        if result is None:
            return (
                {"error_code": "BX0000", "error": "User not found."},
                404,
                {"Content-Type": "application/json"},
            )

        if result["admin"] == 0:
            return (
                {"error_code": "BX0001", "error": "User not authorized."},
                403,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = "SELECT id, username, email, verified, admin as is_admin FROM users;"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()

        return {"users": result}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@users_api.get("/users/is_admin")
@limiter.limit("60/minute")
@token_required
@give_connection
def is_admin(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = "SELECT admin FROM users WHERE id = ?;"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        cursor.close()

        if result is None:
            return (
                {"error_code": "BX0000", "error": "User not found."},
                404,
                {"Content-Type": "application/json"},
            )

        return (
            {"is_admin": result["admin"]},
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


@users_api.get("/users/<int:uid>")
@limiter.limit("60/minute")
@give_connection
def get_user_info(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """\
SELECT u.id, u.username, c.image, c.phone, c.contactInfo
FROM users as u
INNER JOIN userscustomization as c ON u.id = c.recipientId
WHERE u.id = ?;"""

        cursor.execute(query, (uid,))
        user = cursor.fetchone()
        cursor.close()

        if user is None:
            return (
                {"error_code": "BX0000", "error": "User not found."},
                404,
                {"Content-Type": "application/json"},
            )

        user["contactInfo"] = json.loads(user["contactInfo"])

        return (
            user,
            200,
            {"Content-Type": "application/json"},
        )
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


@users_api.get("/users/<uid>/products")
@limiter.limit("60/minute")
@give_connection
def get_user_products(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        query = """\
SELECT p.id, p.pid, p.name, p.images, c.name as catName, u.username as ownerName, p.price, p.customization,
p.rating, p.description, p.availability, p.deliveryOption
FROM products as p
INNER JOIN categories as c ON p.catId = c.id
INNER JOIN users as u ON p.owner = u.id
WHERE p.owner = ?;"""

        cursor.execute(query, (uid,))
        products = cursor.fetchall()
        cursor.close()

        for product in products:
            product["images"] = json.loads(product["images"])
            product["customization"] = json.loads(product["customization"])

        return (
            {
                "products": products,
            },
            200,
            {"Content-Type": "application/json"},
        )

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
