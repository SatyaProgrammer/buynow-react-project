from backend.src.utils.test import Test
from backend.src.lib.db import create_connection
import os
from requests import Session
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.test")

host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
pwd = os.getenv("DB_PASS")


class UserTest(Test):
    @classmethod
    def setup(cls):
        if (
            os.system(
                f"remote migrate -- -t 'HOST={host};PORT={port};DB={db};USER={user};PWD={pwd}'"
            )
            != 0
        ):
            cls.fail("Failed to setup")

    @classmethod
    def cleanup(cls):
        if (
            os.system(
                f"remote migrate -- -t 'HOST={host};PORT={port};DB={db};USER={user};PWD={pwd}' -r"
            )
            != 0
        ):
            cls.fail("Failed to cleanup")

    @classmethod
    def test_login_user(cls):
        url = "http://api.localhost/auth/login"
        s = Session()
        resp = s.post(url, json={"username": "kaze", "password": "null"})
        data = resp.json()

        cls.assert_true(resp.status_code == 200, "Login failed")
        cls.assert_true(data["token"] is not None, "Token is None")

    @classmethod
    def test_login_user_wrong_password(cls):
        url = "http://api.localhost/auth/login"
        s = Session()
        resp = s.post(url, json={"username": "kaze", "password": "wrong"})

        cls.assert_true(resp.status_code == 401, "Login succeeded")


UserTest.run()
