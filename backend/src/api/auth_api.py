from flask import Blueprint, request
from secrets import token_urlsafe
import jwt
import os
from backend.src.lib import Global
from backend.src.lib.passwd import safe_compare, make_password
from backend.src.middleware.auth_middleware import token_required
from backend.src.lib.validate import validate_password, validate_email
from backend.src.lib.mailing import send_verification_email, send_forgot_password_email
from backend.src.middleware.rate_limiter import limiter

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
        cursor = db_conn.cursor(prepared=True)
        
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
@limiter.limit("3 per minute")
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
        cursor = db_conn.cursor(prepared=True)
        
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
        
@auth_api.post("/auth/verify")
@limiter.limit("30 per hour")
def verify_email():
    try:
        data = request.get_json()
        
        if not data:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
            
        token = data["token"]
        
        if not token:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
            
        email = Global.verification_map.get(token)
        if email is None:
            return {
                "error_code": "BX0301",
                "error": "Invalid token."
            }, 400, {"Content-Type": "application/json"}
        
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        
        sql = "UPDATE users SET verified = 1 WHERE email = %s"
        
        cursor.execute(sql, (email,))
        
        db_conn.commit()
        
        return {
            "message": "Email verified."
        }, 200, {"Content-Type": "application/json"}
        
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@auth_api.get("/auth/test")
@limiter.limit("1 per 10 seconds")
@token_required
def test_auth_api(uid):
    return {
        "message": f"Test successful: {uid}"
    }, 200, {"Content-Type": "application/json"}
    
@auth_api.get("/auth/logout")
@token_required
def logout(uid):
    try:
        token = Global.tokens.pop(uid)
        if token is None:
            return {
                "error_code": "BX9901",
                "error": "Not logged in. (Also this is an absurd error)"
            }, 401, {"Content-Type": "application/json"}
        
        return {
            "message": "Logged out."
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@auth_api.post("/auth/send_forgot")
@limiter.limit("3 per minute")
def send_forgot_password():
    try:
        data = request.get_json()
        
        if not data:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
            
        email = data["email"]
        
        if not email:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
            
        if not validate_email(email):
            return {
                "error_code": "BX0203",
                "error": "Invalid email."
            }, 400, {"Content-Type": "application/json"}
            
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        
        sql = "SELECT id FROM users WHERE email = %s"
        cursor.execute(sql, (email,))
        
        if cursor.fetchone() is None:
            return {
                "error_code": "BX0206",
                "error": "Email does not exist."
            }, 400, {"Content-Type": "application/json"}
        
        token = token_urlsafe(32)
        
        Global.forgot_password_map[token] = email
        
        send_forgot_password_email(email, token)
        
        return {
            "message": "Email sent."
        }, 200, {"Content-Type": "application/json"}
        
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}


@auth_api.post("/auth/forgot")
@limiter.limit("3 per minute")
def forgot_password():
    try:
        data = request.get_json()
        
        if not data:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
        
        password = data["password"]
        token = data["token"]
        
        if not password or not token:
            return {
                "error_code": "BX0201",
                "error": "Missing required fields."
            }, 400, {"Content-Type": "application/json"}
            
        if not validate_password(password):
            return {
                "error_code": "BX0202",
                "error": "Invalid password."
            }, 400, {"Content-Type": "application/json"}
            
        email = Global.forgot_password_map.get(token)
        if email is None:
            return {
                "error_code": "BX0301",
                "error": "Invalid token."
            }, 400, {"Content-Type": "application/json"}
            
        db_conn = Global.db_conn
        cursor = db_conn.cursor(prepared=True)
        
        passwd, salt = make_password(password)
        
        sql = "UPDATE users SET password = %s, salt = %s WHERE email = %s"
        
        cursor.execute(sql, (passwd, salt, email))
        
        db_conn.commit()
        
        return {
            "message": "Password changed."
        }, 200, {"Content-Type": "application/json"}
        
    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}