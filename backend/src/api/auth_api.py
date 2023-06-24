import os
from secrets import token_urlsafe

import jwt
from flask import Blueprint, request
from werkzeug.exceptions import InternalServerError

from backend.src.lib import Global, give_connection
from backend.src.lib.mailing import send_forgot_password_email, send_verification_email
from backend.src.lib.passwd import make_password, safe_compare
from backend.src.lib.validate import validate_email, validate_password
from backend.src.middleware.auth_middleware import token_required, maybe_token_required
from backend.src.middleware.rate_limiter import limiter

auth_api = Blueprint("auth_api", __name__)


@auth_api.post("/auth/login")
@limiter.limit("10/minute")
@give_connection
def login(db_conn):
    try:
        request_data = request.get_json()
        name = request_data["username"]
        password = request_data["password"]

        # Global.console.print(f"[green]Username: {name}[/green]")
        # Global.console.print(f"[red]Password: {password}[/red]")

        cursor = db_conn.cursor(prepared=True)

        sql = "SELECT id, password, salt FROM users WHERE username = %s"

        cursor.execute(sql, (name,))
        result = cursor.fetchone()

        if result is None:
            return (
                {"error_code": "BX0101", "error": "Invalid username or password."},
                401,
                {"Content-Type": "application/json"},
            )

        user_id, hashed, salt = result

        if not safe_compare(password, hashed, salt):
            return (
                {"error_code": "BX0101", "error": "Invalid username or password."},
                401,
                {"Content-Type": "application/json"},
            )

        rel_key = token_urlsafe(16)
        Global.tokens[user_id] = rel_key

        return (
            {
                "token": jwt.encode(
                    {"user_id": user_id, "key": rel_key},
                    os.getenv("JWT_KEY"),
                    algorithm="HS256",
                )
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


@auth_api.post("/auth/register")
@limiter.limit("3 per minute")
@give_connection
def register(db_conn):
    try:
        request_data = request.get_json()
        name = request_data["username"]
        password = request_data["password"]
        email = request_data["email"]

        if not name or not password or not email:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_password(password):
            return (
                {"error_code": "BX0202", "error": "Invalid password."},
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_email(email):
            return (
                {"error_code": "BX0203", "error": "Invalid email."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True)

        sql = "SELECT id FROM users WHERE username = %s"

        cursor.execute(sql, (name,))
        result = cursor.fetchone()
        if result is not None:
            return (
                {"error_code": "BX0204", "error": "Username already exists."},
                400,
                {"Content-Type": "application/json"},
            )

        sql = "SELECT id FROM users WHERE email = %s"

        cursor.execute(sql, (email,))
        result = cursor.fetchone()
        if result is not None:
            return (
                {"error_code": "BX0205", "error": "Email already exists."},
                400,
                {"Content-Type": "application/json"},
            )

        passwd, salt = make_password(password)

        sql = "INSERT INTO users (username, password, salt, email) VALUES (%s, %s, %s, %s)"

        cursor.execute(sql, (name, passwd, salt, email))
        uid = cursor.lastrowid

        sql = "INSERT INTO userscustomization (recipientId, theme) VALUES (%s, %s)"
        cursor.execute(sql, (uid, "light"))

        db_conn.commit()

        user_id = cursor.lastrowid

        verify_token = token_urlsafe(32)
        send_verification_email(email, name, verify_token)

        rel_key = token_urlsafe(16)
        Global.tokens[user_id] = rel_key

        return (
            {
                "uid": user_id,
                "token": jwt.encode(
                    {"user_id": user_id, "key": rel_key},
                    os.getenv("JWT_KEY"),
                    algorithm="HS256",
                ),
            },
            201,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@auth_api.post("/auth/verify")
@limiter.limit("30 per hour")
@give_connection
def verify_email(db_conn):
    try:
        data = request.get_json()

        if not data:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        token = data["token"]

        if not token:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        email = Global.verification_map.get(token)
        if email is None:
            return (
                {"error_code": "BX0301", "error": "Invalid token."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True)

        sql = "UPDATE users SET verified = 1 WHERE email = %s"

        cursor.execute(sql, (email,))

        db_conn.commit()

        return {"message": "Email verified."}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@auth_api.get("/auth/resend_verify")
@limiter.limit("1 per 60 seconds")
@token_required
@give_connection
def resend_verification_email(db_conn, uid):
    try:
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = "SELECT email, username FROM users WHERE id = %s"
        cursor.execute(sql, (uid,))
        data = cursor.fetchone()
        email = data["email"]
        name = data["username"]

        verify_token = token_urlsafe(32)
        send_verification_email(email, name, verify_token)

        return (
            {"message": "Verification email sent."},
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


@auth_api.get("/auth/test")
@limiter.limit("1 per 10 seconds")
@token_required
@give_connection
def test_auth_api(db_conn, uid):
    return (
        {"message": f"Test successful: {uid}"},
        200,
        {"Content-Type": "application/json"},
    )


@auth_api.get("/auth/logout")
@maybe_token_required
def logout(uid):
    try:
        if uid is None:
            return (
                {"message": "No token anyway."},
                200,
                {"Content-Type": "application/json"},
            )

        token = Global.tokens.pop(uid)
        if token is None:
            return (
                {
                    "error_code": "BX9901",
                    "error": "Not logged in. (Also this is an absurd error)",
                },
                401,
                {"Content-Type": "application/json"},
            )

        return {"message": "Logged out."}, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@auth_api.post("/auth/send_forgot")
@limiter.limit("3 per minute")
@give_connection
def send_forgot_password(db_conn):
    try:
        data = request.get_json()

        if not data:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        email = data["email"]

        if not email:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_email(email):
            return (
                {"error_code": "BX0203", "error": "Invalid email."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True)

        sql = "SELECT id FROM users WHERE email = %s"
        cursor.execute(sql, (email,))

        if cursor.fetchone() is None:
            return (
                {"error_code": "BX0206", "error": "Email does not exist."},
                400,
                {"Content-Type": "application/json"},
            )

        token = token_urlsafe(32)

        Global.forgot_password_map[token] = email

        send_forgot_password_email(email, token)

        return {"message": "Email sent."}, 200, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return (
            {"error_code": "BX0000", "error": "Something went wrong."},
            500,
            {"Content-Type": "application/json"},
        )


@auth_api.post("/auth/forgot")
@limiter.limit("3 per minute")
@give_connection
def forgot_password(db_conn):
    try:
        data = request.get_json()

        if not data:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        password = data["password"]
        token = data["token"]

        if not password or not token:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_password(password):
            return (
                {"error_code": "BX0202", "error": "Invalid password."},
                400,
                {"Content-Type": "application/json"},
            )

        email = Global.forgot_password_map.get(token)
        if email is None:
            return (
                {"error_code": "BX0301", "error": "Invalid token."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True)

        passwd, salt = make_password(password)

        sql = "UPDATE users SET password = %s, salt = %s WHERE email = %s"

        cursor.execute(sql, (passwd, salt, email))

        db_conn.commit()

        return (
            {"message": "Password changed."},
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


@auth_api.post("/auth/change_password")
@limiter.limit("3 per minute")
@token_required
@give_connection
def change_password(db_conn, uid):
    try:
        data = request.get_json()

        old_pass = data["old_password"]
        new_pass = data["new_password"]

        if not old_pass or not new_pass:
            return (
                {"error_code": "BX0201", "error": "Missing required fields."},
                400,
                {"Content-Type": "application/json"},
            )

        cursor = db_conn.cursor(prepared=True, dictionary=True)

        sql = "SELECT password, salt FROM users WHERE id = %s"
        cursor.execute(sql, (uid,))
        result = cursor.fetchone()

        if result is None:
            return (
                {"error_code": "BX0301", "error": "Invalid token."},
                400,
                {"Content-Type": "application/json"},
            )

        passwd = result["password"]
        salt = result["salt"]

        if not safe_compare(old_pass, passwd, salt):
            return (
                {"error_code": "BX0205", "error": "Incorrect password."},
                400,
                {"Content-Type": "application/json"},
            )

        if not validate_password(new_pass):
            return (
                {"error_code": "BX0202", "error": "Invalid password."},
                400,
                {"Content-Type": "application/json"},
            )

        new_passwd, new_salt = make_password(new_pass)

        sql = "UPDATE users SET password = %s, salt = %s WHERE id = %s"
        cursor.execute(sql, (new_passwd, new_salt, uid))
        db_conn.commit()

        token = Global.tokens.pop(uid, None)
        if token is None:
            return {"error_code": "BX9901", "error": "Not logged in. Absurd error."}

        return (
            {"message": "Password changed. Please login again."},
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
