from backend.src.utils.test import Test


class EhTest(Test):
    @classmethod
    def setup(cls):
        cls.console.print("Setting up...")

    @classmethod
    def cleanup(cls):
        cls.console.print("Cleaning up...")

    @classmethod
    def test_false(cls):
        cls.assert_false(False, "False is False")


EhTest.run()
