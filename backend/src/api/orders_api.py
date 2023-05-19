from flask import Blueprint, request
from backend.src.lib import Global
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter

orders_api = Blueprint("orders_api", __name__)

@orders_api.get("/orders")
@token_required
@limiter.limit("10/minute")
def get_orders(uid):
    try:
        db_conn = Global.db_conn
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE userId = ?", (uid,))
        orders = cursor.fetchall()
        cursor.close()

        return {
            "orders": orders
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        
@orders_api.post("/orders")
@token_required
@limiter.limit("10/minute")
def create_order(uid):
    try:
        db_conn = Global.db_conn
        order_data = request.get_json()
        orders = order_data["orders"]
        
        # create tracking number
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("INSERT INTO trackings (status, userId) VALUES ('pending', ?)", (uid,))
        tracking_id = cursor.lastrowid
        
        if tracking_id is None:
            return {
                "error_code": "BX0000",
                "error": "Something went wrong."
            }, 500, {"Content-Type": "application/json"}
        
        for order in orders:
            cursor = db_conn.cursor(prepared=True)
            pid = order["pid"]
            
            cursor.execute("SELECT stock FROM products WHERE id = ?", (pid,))
            stock = cursor.fetchone()[0]
            
            if stock < order["quantity"]:
                return {
                    "error_code": "BX0102",
                    "error": "Insufficient stock."
                }, 400, {"Content-Type": "application/json"}
                
        for order in orders:
            cursor = db_conn.cursor(prepared=True)
            pid = order["pid"]
            quantity  = order["quantity"]
            
            cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (quantity, pid))
                        
            cursor = db_conn.cursor(prepared=True)
            cursor.execute("SELECT price FROM products WHERE id = ?", (pid,))
            price = cursor.fetchone()[0]
            
            cursor = db_conn.cursor(prepared=True)
            cost = price * order["quantity"]
            cursor.execute("INSERT INTO orders (trackingNumber, productId, quantity, cost), VALUES (?, ?, ?, ?)", (tracking_id, pid, quantity, cost))
        
        db_conn.commit()
        
        return {
            "message": "Order created."
        }, 201, {"Content-Type": "application/json"}
    except Exception as e:
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}
        

@orders_api.get("/orders/<tracking_number>")
@token_required
@limiter.limit("10/minute")
def get_order(uid, tracking_number):
    try:
        db_conn = Global.db_conn
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM trackings WHERE id = ?", (tracking_number,))
        tracking = cursor.fetchone()
        cursor.close()
        
        if tracking is None:
            return {
                "error_code": "BX0101",
                "error": "Order not found."
            }, 404, {"Content-Type": "application/json"}
            
        if tracking["userId"] != uid:
            return {
                "error_code": "BX0103",
                "error": "You are not allowed to view this order."
            }, 403, {"Content-Type": "application/json"}
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE trackingNumber = ?", (tracking_number,))
        orders = cursor.fetchall()
        cursor.close()
        
        if orders is None:
            return {
                "error_code": "BX0101",
                "error": "Order not found."
            }, 404, {"Content-Type": "application/json"}
        
        return {
            "orders": orders
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}

@orders_api.post("/orders/<tracking_number>")
@token_required
@limiter.limit("10/minute")
def update_order_status(uid, tracking_number):
    try:
        db_conn = Global.db_conn
        order_data = request.get_json()
        status = order_data["status"]
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("SELECT * FROM trackings WHERE id = ?", (tracking_number,))
        tracking = cursor.fetchone()
        cursor.close()
        
        if tracking is None:
            return {
                "error_code": "BX0101",
                "error": "Order not found."
            }, 404, {"Content-Type": "application/json"}
            
        if tracking["userId"] != uid:
            return {
                "error_code": "BX0103",
                "error": "You are not allowed to update this order."
            }, 403, {"Content-Type": "application/json"}
        
        cursor = db_conn.cursor(prepared=True, dictionary=True)
        cursor.execute("UPDATE trackings SET status = ? WHERE id = ?", (status, tracking_number))
        cursor.close()
        
        db_conn.commit()
        
        return {
            "message": "Order status updated."
        }, 200, {"Content-Type": "application/json"}
    except Exception as e:
        return {
            "error_code": "BX0000",
            "error": "Something went wrong."
        }, 500, {"Content-Type": "application/json"}