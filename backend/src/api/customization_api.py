import json

from flask import Blueprint, request

from backend.src.lib import Global
from backend.src.lib.validate import validate_json, validate_phone
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

cust_api = Blueprint("cust_api", __name__)


@cust_api.get("/customization")
@token_required
def get_customization(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = """\
SELECT u.id, u.username, c.theme, c.image, c.phone, c.contactInfo
FROM users as u
INNER JOIN userscustomization as c ON u.id = c.recipientId
WHERE u.id = ?;
        """

        cursor.execute(sql, (uid,))
        result = cursor.fetchone()
        cursor.close()

        if result is None:
            # Create a new customization
            cursor = db_conn.cursor(prepared=True)
            sql = """INSERT INTO userscustomization (recipientId, theme) VALUES (%s, %s)"""
            cursor.execute(sql, (uid, "light"))
            db_conn.commit()
            cursor.close()

            cursor = db_conn.cursor(prepared=True, dictionary=True)
            sql = """SELECT * FROM userscustomization WHERE recipientId = %s"""
            cursor.execute(sql, (uid,))
            result = cursor.fetchone()
            cursor.close()

        if result["contactInfo"]:
            result["contactInfo"] = json.loads(result["contactInfo"])

        return {"customization": result}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@cust_api.put("/customization")
@token_required
@limiter.limit("1/second")
def update_customization(uid):
    try:
        data = request.get_json()

        theme = data["theme"]
        image = data["image"]
        phone = data["phone"]
        contact_info = data["contactInfo"]

        print(contact_info)
        print(type(contact_info))

        if theme not in ["light", "dark"]:
            return (
                {
                    "error_code": "BX1601",
                    "error": "Invalid theme",
                },
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_json(json.dumps(contact_info)):
            return (
                {
                    "error_code": "BX1602",
                    "error": "Invalid contact info JSON",
                },
                400,
                {"Content-Type": "application/json"},
            )

        # if not validate_phone(phone):
        #     return {
        #         "error_code": "BX1603",
        #         "error": "Invalid phone number",
        #     }, 400, {"Content-Type": "application/json"}

        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = "UPDATE userscustomization SET theme = %s, image = %s, phone = %s, contactInfo = %s WHERE recipientId = %s"
        cursor.execute(sql, (theme, image, phone, json.dumps(contact_info), uid))
        db_conn.commit()

        return (
            {"message": "Update successful!"},
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0001", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@cust_api.delete("/customization")
@limiter.limit("1/second")
@token_required
def delete_customization(uid):
    try:
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = "DELETE FROM userscustomization WHERE recipientId = %s"
        cursor.execute(sql, (uid,))
        db_conn.commit()

        return (
            {"message": "Delete successful!"},
            200,
            {"Content-Type": "application/json"},
        )

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0002", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )
