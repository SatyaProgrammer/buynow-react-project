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
            # stuffs
        ]


ProductTest.run()
