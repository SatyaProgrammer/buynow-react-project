from backend.src.utils.test import Test


class LahTest(Test):
    @classmethod
    def setup(cls):
        cls.console.print("Setting up...")

    @classmethod
    def cleanup(cls):
        cls.console.print("Cleaning up...")

    @classmethod
    def test_true(cls):
        cls.assert_true(True, "True is True")


LahTest.run()
