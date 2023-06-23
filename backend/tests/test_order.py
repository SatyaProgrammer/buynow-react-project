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


class OrderTest(Test):
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
            "test_create_order",
            "test_get_my_orders",
            "test_get_vendor_orders",
            "test_update_tracking_status",
        ]

    @classmethod
    def login_kaze(cls, session):
        r = session.post(
            f"{baseurl}/auth/login", json={"username": "kaze", "password": "null"}
        )
        token = r.json()["token"]

        session.headers.update({"Authorization": f"Basic {token}"})

    @classmethod
    def login_reimu(cls, session):
        r = session.post(
            f"{baseurl}/auth/login", json={"username": "reimu", "password": "hakurei"}
        )
        token = r.json()["token"]

        session.headers.update({"Authorization": f"Basic {token}"})

    @classmethod
    def test_create_order(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.get(f"{baseurl}/products/matching?limit=-1")
        products = r.json()

        r = s.post(
            f"{baseurl}/trackings",
            json={
                "orders": [
                    {"pid": products[0]["pid"], "quantity": 1},
                    {"pid": 3, "quantity": 1},
                ]
            },
        )

        cls.assert_true(r.status_code == 201, "Failed to create order")

    @classmethod
    def test_get_my_orders(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.get(f"{baseurl}/trackings")

        cls.assert_true(r.status_code == 200, r.json())
        tn = r.json()["trackings"][0]["id"]

        r = s.get(f"{baseurl}/trackings/{tn}")
        cls.assert_true(r.status_code == 200, r.json())

        data = r.json()
        cls.assert_true(len(data["orders"]) == 2)
        cls.assert_true(
            data["orders"][0]["pid"] == "McuxrwGHJqnlyD-QrsyzpS_YoEnS3VxWic7GPLAm-wM"
        )
        cls.assert_true(
            data["orders"][1]["pid"] == "3eIUZ2DpEqhjofCCuxAr3m86uLZC0P8S30U1pT9fkVg"
        )

    @classmethod
    def test_get_vendor_orders(cls):
        s = Session()
        cls.login_reimu(s)

        r = s.get(f"{baseurl}/trackings/vendor")

        cls.assert_true(r.status_code == 200, r.json())

        data = r.json()

        cls.assert_true(len(data["orders"]) == 2)

    @classmethod
    def test_update_tracking_status(cls):
        s = Session()
        cls.login_reimu(s)

        r = s.post(f"{baseurl}/trackings/1", json={"status": "completed"})

        cls.assert_true(r.status_code == 200, r.json())


OrderTest.run()
