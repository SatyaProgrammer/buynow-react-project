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
from backend.src.lib.db import create_connection
from backend.src.lib import Global
from backend.src.middleware.rate_limiter import limiter

load_dotenv(dotenv_path=".env.local")

app = Flask(__name__, subdomain_matching=True)
CORS(app)
app.config['SERVER_NAME'] = "localhost"
app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)
limiter.init_app(app)

__db_conn = create_connection()
if __db_conn.is_ok():
    db_conn = __db_conn.unwrap()
else:
    raise Exception("Cannot create a database connection")

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

def main() -> None:
    app.run()
    pass

if __name__ == '__main__':
    main()