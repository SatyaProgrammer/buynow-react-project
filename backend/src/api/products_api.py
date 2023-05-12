import json
from flask import Blueprint, request
from backend.src.lib.passwd import make_product_id
from backend.src.lib.validate import base64_valid
from backend.src.lib import Global
from backend.src.middleware.rate_limiter import limiter
from backend.src.middleware.auth_middleware import token_required
from backend.src.models import User, Category, Product
from backend.src.lib.validate import validate_json

prod_api = Blueprint('products_api', __name__)

@prod_api.get("/products/<product_id>")
@limiter.limit("100 per minute")
def get_product(product_id: str):
    if len(product_id) != 43:
        return {
            "error_code": "BX1101",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
        
    # product_id must be base64
    if not base64_valid(product_id):
        return {
            "error_code": "BX1101",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
    
    result = Product.pid(product_id)
    return ({
        "pid": result["pid"],
        "name": result["name"],
        "images": result["images"],
        "category": result["catName"],
        "owner": result["ownerName"],
        "price": result["price"],
        "customization": result["customization"],
        "rating": result["rating"],
        "description": result["description"],
        "availability": result["availability"],
        "deliveryOption": result["deliveryOption"]
    }, 200, {"Content-Type": "application/json"})

@prod_api.get("/products/matching")
@limiter.limit("100 per minute")
def get_matching_products():
    try:
        search_criteria = {
            k: v for k, v in request.args.items() if k != "offset" and k != "limit"
        }
        
        print(search_criteria)
        
        if len(search_criteria) == 0:
            # return all products, sorted by newest item first
            offset = request.args.get("offset", 0)
            limit = request.args.get("limit", 25)
            
            result = Product.fetch_newest([], offset, limit)
            return (result, 200, {"Content-Type": "application/json"})
        else:
            # return matching products
            offset = request.args.get("offset", 0)
            limit = request.args.get("limit", 25)
            
            result = Product.fetch_matching([], search_criteria, offset, limit, sort_newest=True)
            res = {
                "pid": result["pid"],
                "name": result["name"],
                "images": result["images"],
                "category": result["catName"],
                "owner": result["ownerName"],
                "price": result["price"],
                "customization": result["customization"],
                "rating": result["rating"],
                "description": result["description"],
                "availability": result["availability"],
                "deliveryOption": result["deliveryOption"]
            }
            return (res, 200, {"Content-Type": "application/json"})
    except Exception as e:
        Global.console.print_exception(show_locals=True)
        return ({
            "error_code": "BX1000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"})

@prod_api.post("/products/add")
@limiter.limit("5 per minute")
@token_required
def add_products(uid):
    try:
        user_id = uid
        user = User.id(user_id)
        if user["userType"] != "vendor":
            return {
                "error_code": "BX1201",
                "error": "You are not a vendor."
            }, 401, {"Content-Type": "application/json"}
        
        request_data = request.get_json()
        cat_name = request_data["category"]
        cat = Category.fetch_matching(["id", "name"], {"name": cat_name})
        if len(cat) == 0:
            return {
                "error_code": "BX1202",
                "error": "Invalid category."
            }, 400, {"Content-Type": "application/json"}

        cat_id = cat[0]["id"]
        
        name = request_data["name"]
        images = request_data["images"]
        owner = user_id
        price = request_data["price"]
        customization = request_data["customization"]
        description = request_data["description"]
        availability = request_data["availability"]
        deliveryOption = request_data["deliveryOption"]
        
        if not validate_json(images) or not validate_json(customization):
            return {
                "error_code": "BX1203",
                "error": "Invalid JSON."
            }, 400, {"Content-Type": "application/json"}
        
        try:
            price = float(price)
        except:
            return {
                "error_code": "BX1204",
                "error": "Invalid price."
            }, 400, {"Content-Type": "application/json"}
        
        pid = make_product_id()
        while not Product.attest_nonexistent(pid):
            pid = make_product_id()
            
        res = Product.add({
            "pid": pid,
            "name": name,
            "images": images,
            "catId": cat_id,
            "owner": owner,
            "price": price,
            "customization": customization,
            "rating": 0,
            "description": description,
            "availability": availability,
            "deliveryOption": deliveryOption
        })
        
        if res.is_ok():
            return {
                "pid": pid
            }, 200, {"Content-Type": "application/json"}
        else:
            Global.console.print(res.unwrap_err())
            return {
                "error_code": "BX1299",
                "error": "Couldn't add product."
            }, 500, {"Content-Type": "application/json"}

    except Exception as e:
        Global.console.print_exception()
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}