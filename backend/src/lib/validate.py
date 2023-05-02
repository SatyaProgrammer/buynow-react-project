from string import ascii_letters, digits
import re

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
    
    if not re.match(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", email):
        return False
    
    return True