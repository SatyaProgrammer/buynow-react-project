from string import ascii_letters, digits

url_safe = ascii_letters + digits + "-_"
def base64_valid(s: str) -> bool:
    for c in s:
        if c not in url_safe:
            return False
    
    return True