from hashlib import sha512
from dotenv import load_dotenv
from flask import Flask

load_dotenv()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# def main() -> None:
#     app.run()
#     pass

# if __name__ == '__main__':
#     main()