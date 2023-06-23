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


class ProductTest(Test):
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
            "test_get_all_products",
            "test_get_all_products_with_limit",
            "test_get_product",
            "test_get_product_not_found",
            "test_create_product",
            "test_create_product_unauthorized",
            "test_get_categories",
            "test_get_my_products",
            "test_update_product",
            "test_delete_product",
        ]

    @classmethod
    def test_get_all_products(cls):
        s = Session()
        r = s.get(f"{baseurl}/products/matching?limit=-1")

        cls.assert_true(r.status_code == 200, "Failed to get all products")
        cls.assert_true(len(r.json()) != 0, "Failed to get all products")

    @classmethod
    def test_get_all_products_with_limit(cls):
        s = Session()
        r = s.get(f"{baseurl}/products/matching?limit=1")

        cls.assert_true(r.status_code == 200, "Failed to get all products")
        cls.assert_true(len(r.json()) == 1, "Failed to get all products")

    @classmethod
    def test_get_product(cls):
        s = Session()
        r = s.get(f"{baseurl}/products/matching?limit=1")
        product_id = r.json()[0]["pid"]

        r = s.get(f"{baseurl}/products/{product_id}")

        cls.assert_true(r.status_code == 200, "Failed to get product")
        cls.assert_true(r.json()["pid"] == product_id, "Failed to get product")

    @classmethod
    def test_get_product_not_found(cls):
        s = Session()
        r = s.get(f"{baseurl}/products/mvIpsnmvIpsnmvIpsnmvIpsnmvIpsnmvIpsnmvIpsnI")

        cls.assert_true(r.status_code == 404, "Found product?")

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
    def test_create_product(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.post(
            f"{baseurl}/products/add",
            json={
                "name": "test",
                "images": ["test"],
                "category": "Office",
                "price": 12.99,
                "customization": {"color": "#ff0000", "size": "M"},
                "description": "test",
                "availability": 10,
                "deliveryOption": "On Person",
            },
        )
        cls.assert_true(r.status_code == 201, "Failed to create product")
        cls.assert_true(r.json()["pid"])

    @classmethod
    def test_create_product_unauthorized(cls):
        s = Session()

        r = s.post(
            f"{baseurl}/products/add",
            json={
                "name": "test",
                "images": ["test"],
                "category": "Office",
                "price": 12.99,
                "customization": {"color": "#ff0000", "size": "M"},
                "description": "test",
                "availability": 10,
                "deliveryOption": "On Person",
            },
        )
        cls.assert_true(r.status_code == 401, "Authorized to create product")

    @classmethod
    def test_get_categories(cls):
        s = Session()
        r = s.get(f"{baseurl}/categories")

        cls.assert_true(r.status_code == 200, "Failed to get categories")
        cls.assert_true(len(r.json()) != 0, "Failed to get categories")

    @classmethod
    def test_get_my_products(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.get(f"{baseurl}/products/me")

        cls.assert_true(r.status_code == 200, "Failed to get my products")
        cls.assert_true(len(r.json()) != 0, "Failed to get my products")

    @classmethod
    def test_update_product(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.get(f"{baseurl}/products/me")
        product_id = r.json()["products"][0]["pid"]

        r = s.post(
            f"{baseurl}/products/update",
            json={
                "pid": product_id,
                "name": "test",
                "images": ["test"],
                "category": "Office",
                "price": 12.99,
                "customization": {"color": "#ff0000", "size": "M"},
                "description": "test",
                "availability": 10,
                "deliveryOption": "On Person",
            },
        )

        cls.assert_true(r.status_code == 200, "Failed to update product")

    @classmethod
    def test_delete_product(cls):
        s = Session()
        cls.login_kaze(s)

        r = s.get(f"{baseurl}/products/me")
        product_id = r.json()["products"][0]["pid"]

        r = s.post(f"{baseurl}/products/delete", json={"pid": product_id})

        cls.assert_true(r.status_code == 200, "Failed to delete product")


ProductTest.run()
