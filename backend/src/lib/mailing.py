from backend.src.lib import Global

def send_verification_email(email: str, token: str):
    Global.verification_map[token] = email
    
    