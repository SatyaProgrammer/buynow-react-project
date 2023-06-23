from backend.src.utils.test import Test
import os
from requests import Session
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.test")

host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
pwd = os.getenv("DB_PASS")

baseurl = "http://api.localhost"


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
    def order(cls):
        return [
            "test_login_user",
            "test_login_user_wrong_password",
        ]

    @classmethod
    def test_login_user(cls):
        s = Session()
        resp = s.post(
            f"{baseurl}/auth/login", json={"username": "kaze", "password": "null"}
        )
        data = resp.json()

        cls.assert_true(resp.status_code == 200, "Login failed")
        cls.assert_true(data["token"] is not None, "Token is None")

    @classmethod
    def test_login_user_wrong_password(cls):
        s = Session()
        resp = s.post(
            f"{baseurl}/auth/login", json={"username": "kaze", "password": "wrong"}
        )

        cls.assert_true(resp.status_code == 401, "Login succeeded")

    @classmethod
    def test_register_user(cls):
        s = Session()
        resp = s.post(
            f"{baseurl}/auth/register",
            json={
                "username": "testmeballs",
                "password": "testesticles",
                "email": "bgrzegorz907@gmail.com",
            },
        )

        cls.assert_true(resp.status_code == 201, "Register failed")

        data = resp.json()
        cls.assert_true(data["uid"] is not None, "UID is None")
        cls.assert_true(data["token"] is not None, "Username is not test")

    @classmethod
    def test_register_user_already_exists(cls):
        s = Session()
        resp = s.post(
            f"{baseurl}/auth/register",
            json={
                "username": "kaze",
                "password": "test",
                "email": "teng.thaisothyrak@gmail.com",
            },
        )

        cls.assert_true(resp.status_code == 400, "Register succeeded")

    # @classmethod
    # def test_resend_verification_email(cls):
    #     s = Session()
    #     resp = s.post(
    #         "http://api.localhost/auth/login",
    #         json={"username": "kaze", "password": "null"},
    #     )
    #     data = resp.json()

    #     cls.assert_true(resp.status_code == 200, "Login failed")
    #     cls.assert_true(data["token"] is not None, "Token is None")

    #     s.headers.update({"Authorization": f"Basic {data['token']}"})

    #     resp = s.get("http://api.localhost/auth/resend_verify")
    #     data = resp.json()

    #     cls.assert_true(resp.status_code == 200, "Resend failed")
    #     cls.assert_true(data["message"] == "Verification email sent.")


UserTest.run()
