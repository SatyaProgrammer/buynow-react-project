import json
import re
from string import ascii_letters, digits

url_safe = ascii_letters + digits + "-_"


def base64_valid(s: str) -> bool:
    for c in s:
        if c not in url_safe:
            return False

    return True


def validate_password(passwd: str) -> bool:
    if len(passwd) < 8:
        return False

    if len(passwd) > 255:
        return False

    return True


def validate_email(email: str) -> bool:
    if len(email) > 255:
        return False

    if not re.match(r"^.+@.+\..+$", email):
        return False

    return True


def validate_json(js: str) -> bool:
    try:
        json.loads(js)
    except ValueError as e:
        return False
    return True


def validate_phone(phone: str) -> bool:
    if len(phone) > 20:
        return False
    if not re.match(r"^\+?[0-9]+$", phone):
        return False
    return True


def validate_verified(db_conn, uid: str | int) -> bool:
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    query = "SELECT verified FROM users WHERE id = ?;"
    cursor.execute(query, (uid,))
    result = cursor.fetchone()
    cursor.close()

    if result is None:
        return False

    return result["verified"] == 1
