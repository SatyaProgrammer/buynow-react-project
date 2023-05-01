from functools import wraps
import jwt
from flask import request, abort
import os
from backend.src.lib import Global

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return {
                "error": "Token is missing."
            }, 401, {"Content-Type": "application/json"}
        
        try:
            data = jwt.decode(token, os.getenv("JWT_KEY"), algorithms=["HS256"])
            user_id = data["user_id"]
            rel_key = Global.tokens.get(user_id)
            if rel_key is None:
                return {
                    "error": "Token is invalid."
                }, 401, {"Content-Type": "application/json"}
            
            if rel_key != data["key"]:
                return {
                    "error": "Token is invalid."
                }, 401, {"Content-Type": "application/json"}
        except Exception as e:
            Global.console.print_exception()
            return {
                "error": "Something went wrong."
            }, 500, {"Content-Type": "application/json"}
            
        return f(user_id, *args, **kwargs)
    
    return decorated