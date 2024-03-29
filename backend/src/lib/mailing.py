import os
import smtplib as smtp
import ssl
from typing import Any

from backend.src.lib import Global, Result


def send_verification_email(
    email: str, user: str, token: str
) -> Result[Any, Exception]:
    Global.verification_map[token] = email

    sender = os.getenv("EMAIL_ADDR")
    receivers = [email]

    message = f"""\
From: BuyNow Team <{sender}>
To: {email}
Subject: BuyNow Account Verification

Dear {user}, thank you for registering an account with BuyNow. Please click the link below to verify your account.
{os.getenv("REACT_APP_FRONTEND_URL")}/verify?token={token}

Important note: If you did not remember registering an account with BuyNow, please ignore this email. Do not click the link above.
The link above will expire in 6 hours.

This is an automated email. Please do not reply to this email.

Regards,
BuyNow Team
"""

    try:
        context = ssl.create_default_context()
        port = 465

        with smtp.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
            server.login(sender, os.getenv("EMAIL_APP_PASS"))
            failed = server.sendmail(sender, receivers, message)

            return Result.Ok(failed)
    except Exception as e:
        return Result.Err(e)


def send_forgot_password_email(email: str, token: str) -> Result[Any, Exception]:
    Global.forgot_password_map[token] = email

    sender = os.getenv("EMAIL_ADDR")
    receivers = [email]

    message = f"""\
From: BuyNow Team <{sender}>
To: {email}
Subject: BuyNow Password Reset

Dear user, you have requested to reset your password. Please click the link below to reset your password.
{os.getenv("REACT_APP_FRONTEND_URL")}/reset?token={token}

The link above will expire in 1 hour.

Important note: If you did not request to reset your password, please ignore this email. Do not click the link above.
This is an automated email. Please do not reply to this email.

Regards,
BuyNow Team
"""

    try:
        context = ssl.create_default_context()
        port = 465

        with smtp.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
            server.login(sender, os.getenv("EMAIL_APP_PASS"))
            failed = server.sendmail(sender, receivers, message)

            return Result.Ok(failed)
    except Exception as e:
        return Result.Err(e)
