from rich.console import Console
import os


class Test:
    console = Console()

    def __init__(self):
        raise Exception(
            "This class is not meant to be instantiated. Use the run method instead."
        )

    @classmethod
    def setup(cls):
        pass

    @classmethod
    def cleanup(cls):
        pass

    @classmethod
    def fail(cls, message):
        raise Exception(message)

    @classmethod
    def assert_true(cls, condition, message):
        if not condition:
            raise AssertionError(message)

    @classmethod
    def assert_false(cls, condition, message):
        if condition:
            raise AssertionError(message)

    @classmethod
    def assert_equal(cls, a, b, message):
        if a != b:
            raise AssertionError(message)

    @classmethod
    def assert_not_equal(cls, a, b, message):
        if a == b:
            raise AssertionError(message)

    @classmethod
    def run(cls):
        try:
            cls.console.print(
                f"[bold green]Running tests for {cls.__name__}[/bold green]"
            )

            cls.setup()

            if "order" in dir(cls):
                order = cls.order()
            else:
                order = dir(cls)

            for method in order:
                if method.startswith("test_"):
                    try:
                        cls.console.print(
                            f"[bold blue]Running {method}...[/bold blue]", end=""
                        )
                        getattr(cls, method)()
                        cls.console.print("[bold green]OK[/bold green]")
                    except AssertionError as e:
                        if os.getenv("PYTHON_TEST_VERBOSE", "0") == "1":
                            cls.console.print_exception()
                        cls.console.print(f"[bold red]AssertionError: {e}[/bold red]")

            cls.cleanup()
        except Exception as e:
            cls.console.print_exception()
            cls.console.print(f"[bold red]Exception: {e}[/bold red]")
