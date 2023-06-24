import os
from functools import wraps

import jwt
from flask import request

from backend.src.lib import Global


def token_required(f):
    """Decorator function to automatically check for token in request headers."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return (
                {"error": "Token is missing."},
                401,
                {"Content-Type": "application/json"},
            )

        try:
            data = jwt.decode(token, os.getenv("JWT_KEY"), algorithms=["HS256"])
            user_id = data["user_id"]
            rel_key = Global.tokens.get(user_id)
            if rel_key is None:
                return (
                    {"error_code": "BX0001", "error": "Token is invalid."},
                    401,
                    {"Content-Type": "application/json"},
                )

            if rel_key != data["key"]:
                return (
                    {"error_code": "BX0001", "error": "Token is invalid."},
                    401,
                    {"Content-Type": "application/json"},
                )
        except Exception as e:
            Global.console.print_exception(show_locals=True)
            return (
                {"error_code": "BX0000", "error": "Something went wrong."},
                500,
                {"Content-Type": "application/json"},
            )

        return f(user_id, *args, **kwargs)

    return decorated


def maybe_token_required(f):
    """Decorator function to automatically check for token in request headers."""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return f(None, *args, **kwargs)

        try:
            data = jwt.decode(token, os.getenv("JWT_KEY"), algorithms=["HS256"])
            user_id = data["user_id"]
            rel_key = Global.tokens.get(user_id)
            if rel_key is None:
                return f(None, *args, **kwargs)

            if rel_key != data["key"]:
                return f(None, *args, **kwargs)
        except Exception as e:
            Global.console.print_exception()
            return f(None, *args, **kwargs)

        return f(user_id, *args, **kwargs)

    return decorated
