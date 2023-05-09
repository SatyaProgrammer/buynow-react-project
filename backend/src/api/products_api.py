import json
from flask import Blueprint, abort
from backend.src.lib.validate import base64_valid
from backend.src.lib import Global

prod_api = Blueprint('products_api', __name__)

@prod_api.get("/products/<product_id>")
def get_product(product_id: str):
    if len(product_id) != 43:
        return {
            "error_code": "BX0301",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
        
    # product_id must be base64
    if not base64_valid(product_id):
        return {
            "error_code": "BX0301",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
    
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True)
    sql = "SELECT pid, name, images, catId, owner, price, customization, rating, description, availability, deliveryOption FROM products WHERE pid = %s"
    cursor.execute(sql, (product_id,))
    pid, name, images, cat_id, owner, price, cust, rating, desc, avail, delop = cursor.fetchone()
    print(images, cust)
    cursor.close()
    return ({
        "pid": pid,
        "name": name,
        "images": json.loads(images),
        "catId": cat_id,
        "owner": owner,
        "price": price,
        "customization": json.loads(cust),
        "rating": rating,
        "description": desc,
        "availability": avail,
        "deliveryOption": delop
    }, 200, {"Content-Type": "application/json"})