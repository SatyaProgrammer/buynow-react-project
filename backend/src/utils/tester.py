from os import path, listdir, system, environ
from argparse import ArgumentParser


def main():
    ap = ArgumentParser(description="Python General Setup Tester.")
    ap.add_argument("-v", "--verbose", action="store_true", help="verbose mode")
    args = vars(ap.parse_args())

    if args["verbose"]:
        environ["PYTHON_TEST_VERBOSE"] = "1"

    base_dir = path.dirname(path.dirname(path.dirname(__file__)))

    if not path.exists(path.join(base_dir, "tests")):
        system("mkdir " + path.join(base_dir, "tests"))
        exit(1)

    if path.exists(path.join(base_dir, "tests", "config.py")):
        import backend.tests.config

        if dir(backend.tests.config).__contains__("order"):
            order = backend.tests.config.order
        else:
            order = listdir(
                path.join(path.dirname(path.dirname(path.dirname(__file__))), "tests")
            )
    else:
        order = listdir(
            path.join(path.dirname(path.dirname(path.dirname(__file__))), "tests")
        )

    for test_file in order:
        if (
            test_file == "config.py"
            or test_file == "__init__.py"
            or not test_file.startswith("test_")
        ):
            continue

        filename_no_ext = path.splitext(test_file)[0]
        system(f"python -m backend.tests.{filename_no_ext}")

    exit(0)


if __name__ == "__main__":
    main()
