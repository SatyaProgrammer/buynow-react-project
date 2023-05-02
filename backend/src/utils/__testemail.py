import smtplib as smtp
from dotenv import load_dotenv
import os
from rich.console import Console
import ssl

console = Console()
load_dotenv('.env.local')

def main():
    port = 465
    sender = os.getenv('EMAIL_ADDR')
    receivers = [
        "noraimaisumireko@gmail.com"
    ]

    message = f"""\
From: BuyNow Team <{sender}>
To: noraimaisumireko <{receivers[0]}>
Subject: Test Email

Hi Sumireko, this is a test email from Buynow Team. For real, this time. This time. For real. I swear.
"""
    
    context = ssl.create_default_context()
    
    with smtp.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender, os.getenv("EMAIL_APP_PASS"))
        server.sendmail(sender, receivers, message)

if __name__ == "__main__":
    main()