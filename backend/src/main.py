import os
from dotenv import load_dotenv
from flask import Flask, abort, Blueprint
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from rich.console import Console
from backend.src.api.products_api import prod_api
from backend.src.api.auth_api import auth_api
from backend.src.api.customization_api import cust_api
from backend.src.api.orders_api import orders_api
from backend.src.api.dashboard_api import dashboard_api
from backend.src.api.reviews_api import reviews_api
from backend.src.lib.db import create_connection, msc
from backend.src.lib import Global
from backend.src.middleware.rate_limiter import limiter

load_dotenv(dotenv_path=".env.local")

app = Flask(__name__, subdomain_matching=True)
CORS(app)
app.config['SERVER_NAME'] = os.getenv("SERVER_NAME")
if app.config['SERVER_NAME'] == None:
    raise Exception("FATAL: No SERVER_NAME defined")

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)
limiter.init_app(app)

__db_conn = create_connection()
if __db_conn.is_ok():
    db_conn = __db_conn.unwrap()
else:
    raise Exception("FATAL: Cannot create a database connection")

Global.db_conn = db_conn
Global.console = Console()

api = Blueprint("api", __name__, subdomain="api")

@api.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
    
app.register_blueprint(api, subdomain="api")
app.register_blueprint(prod_api, subdomain="api")
app.register_blueprint(auth_api, subdomain="api")
app.register_blueprint(cust_api, subdomain="api")
app.register_blueprint(orders_api, subdomain="api")
app.register_blueprint(dashboard_api, subdomain="api")
app.register_blueprint(reviews_api, subdomain="api")

@app.errorhandler(404)
def page_not_found(e):
    return {
        "error_code": "BX0000",
        "error": "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again."
    }, 404, {"Content-Type": "application/json"}

@app.errorhandler(Exception)
def handle_all_errors(e):
    Global.console.print(e.original_error)
    return {
        "error_code": "BX0001",
        "error": "Something went wrong."
    }, 500, {"Content-Type": "application/json"}

@app.errorhandler(msc.errors.OperationalError)
def handle_stupid_error(e):
    # probably need to reconnect to the database
    __db_conn = create_connection()
    if __db_conn.is_ok():
        db_conn = __db_conn.unwrap()
    else:
        raise Exception("Cannot create a database connection")
    
    Global.db_conn = db_conn
    return {
        "error_code": "BX0002",
        "error": "The database does not like whatever you are doing. One at a time please."
    }, 500, {"Content-Type": "application/json"}

@app.errorhandler(msc.errors.InterfaceError)
def handle_another_stupid_error(e):
    # probably need to reconnect to the database
    __db_conn = create_connection()
    if __db_conn.is_ok():
        db_conn = __db_conn.unwrap()
    else:
        raise Exception("Cannot create a database connection")
    
    Global.db_conn = db_conn
    return {
        "error_code": "BX0003",
        "error": "The database does not like whatever you are doing. One at a time please."
    }, 500, {"Content-Type": "application/json"}

def main() -> None:
    app.run(host='0.0.0.0')
    pass

if __name__ == '__main__':
    main()
