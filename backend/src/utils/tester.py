from os import path, listdir, system, environ
from argparse import ArgumentParser


def main():
    ap = ArgumentParser(description="Python General Setup Tester.")
    ap.add_argument("-v", "--verbose", action="store_true", help="verbose mode")
    args = vars(ap.parse_args())

    if args["verbose"]:
        environ["PYTHON_TEST_VERBOSE"] = "1"

    for test_file in listdir(
        path.join(path.dirname(path.dirname(path.dirname(__file__))), "tests")
    ):
        if (
            test_file == "config.py"
            or test_file == "__init__.py"
            or not test_file.endswith(".py")
            or not test_file.startswith("test_")
        ):
            continue

        filename_no_ext = path.splitext(test_file)[0]
        system(f"python -m backend.tests.{filename_no_ext}")


if __name__ == "__main__":
    main()
