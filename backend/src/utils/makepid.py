from secrets import token_urlsafe


def main():
    pid = token_urlsafe(32)
    print(pid)


if __name__ == "__main__":
    main()
