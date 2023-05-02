from flask import Blueprint, request
from secrets import token_urlsafe
import jwt
import os
from backend.src.lib import Global
from backend.src.lib.passwd import safe_compare, make_password
from backend.src.middleware.auth_middleware import token_required
from backend.src.lib.validate import validate_password, validate_email
from backend.src.lib.mailing import send_verification_email

auth_api = Blueprint('auth_api', __name__)

@auth_api.post("/auth/login")
def login():
    try:
        request_data = request.get_json()
        name = request_data["username"]
        password = request_data["password"]
        
        # Global.console.print(f"[green]Username: {name}[/green]")
        # Global.console.print(f"[red]Password: {password}[/red]")
        
        db_conn = Global.db_conn
        cursor = db_conn.cursor()
        
        sql = "SELECT id, password, salt FROM users WHERE username = %s"
        
        cursor.execute(sql, (name,))
        result = cursor.fetchone()
        
        if result is None:
            return {
                "error_code": "BX0101",
                "error": "Invalid username or password."
            }, 401, {"Content-Type": "application/json"}
        
        user_id, hashed, salt = result
        
        if not safe_compare(password, hashed, salt):
            return {
                "error_code": "BX0101",
                "error": "Invalid username or password."
            }, 401, {"Content-Type": "application/json"}
        
        rel_key = token_urlsafe(16)
        Global.tokens[user_id] = rel_key
        
        return {
            "token": jwt.encode({
                "user_id": user_id,
                "key": rel_key
            },
            os.getenv("JWT_KEY"),
            algorithm="HS256")
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@auth_api.post("/auth/register")
def register():
    try:
        request_data = request.get_json()
        name = request_data["username"]
        password = request_data["password"]
        email = request_data["email"]
        
        if not name or not password or not email:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
        
        if not validate_password(password):
            return {
                "error_code": "BX0202",
                "error": "Invalid password."
            }, 400, {"Content-Type": "application/json"}
        
        if not validate_email(email):
            return {
                "error_code": "BX0203",
                "error": "Invalid email."
            }, 400, {"Content-Type": "application/json"}
        
        db_conn = Global.db_conn
        cursor = db_conn.cursor()
        
        sql = "SELECT id FROM users WHERE username = %s"
        
        cursor.execute(sql, (name,))
        
        if cursor.fetchone() is not None:
            return {
                "error_code": "BX0204",
                "error": "Username already exists."}, 400, {"Content-Type": "application/json"}
        
        sql = "SELECT id FROM users WHERE email = %s"
        
        cursor.execute(sql, (email,))
        
        if cursor.fetchone() is not None:
            return {
                "error_code": "BX0205",
                "error": "Email already exists."
            }, 400, {"Content-Type": "application/json"}
        
        passwd, salt = make_password(password)
        
        sql = "INSERT INTO users (username, password, salt, email) VALUES (%s, %s, %s, %s)"
        
        cursor.execute(sql, (name, passwd, salt, email))
        
        db_conn.commit()
        
        verify_token = token_urlsafe(32)
        send_verification_email(email, name, verify_token)
        
        return {
            "message": "User created."
        }, 201, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}

        
@auth_api.get("/auth/test")
@token_required
def test_auth_api(uid):
    return {
        "message": f"Test successful: {uid}"
    }, 200, {"Content-Type": "application/json"}