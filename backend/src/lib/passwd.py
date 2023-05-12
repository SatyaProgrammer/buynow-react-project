from hashlib import sha512
from secrets import choice, compare_digest, token_urlsafe
from string import ascii_letters, digits

keys = ascii_letters + digits

def random_salt(n: int) -> str:
    return "".join(choice(keys) for _ in range(n))

def make_password(passwd: str) -> tuple[str, str]:
    salt = random_salt(32)
    prep_str = passwd + salt
    hashed = sha512(prep_str.encode()).hexdigest()
    return hashed, salt

def safe_compare(passwd: str, hashed: str, salt: str) -> bool:
    prep_str = passwd + salt
    hashed2 = sha512(prep_str.encode()).hexdigest()
    return compare_digest(hashed, hashed2)

def make_product_id() -> str:
    return token_urlsafe(32)