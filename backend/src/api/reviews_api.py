from flask import Blueprint, request
from backend.src.middleware.auth_middleware import token_required
from backend.src.middleware.rate_limiter import limiter
from backend.src.lib.validate import base64_valid
from backend.src.models import Product, User
from backend.src.lib import Global

reviews_api = Blueprint("reviews_api", __name__)

@reviews_api.get("/reviews/<pid>")
@limiter.limit("10/minute")
def get_reviews(pid: str):
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    cursor.execute("""\
SELECT r.id, u.username, r.rating, r.comment
FROM reviews
LEFT JOIN users AS u ON u.id = r.authorId
WHERE r.productId = %s""", (pid,))
    result = cursor.fetchall()
    cursor.close()
    
    return {"reviews": result}, 200, {"Content-Type": "application/json"}

@reviews_api.post("/reviews/<pid>")
@limiter.limit("10/minute")
@token_required
def add_review(uid, pid):
    data = request.get_json()
    rating = data["rating"]
    comment = data["comment"]
    
    if len(pid) != 43:
        return {
            "error_code": "BX1205",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}

    # product_id must be base64
    if not base64_valid(pid):
        return {
            "error_code": "BX1205",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}

    if Product.attest_nonexistent(pid):
        return {
            "error_code": "BX1206",
            "error": "Product doesn't exist."
        }, 400, {"Content-Type": "application/json"}
        
    # dont add if already reviewed
    if Product.attest_reviewed(pid, uid):
        return {
            "error_code": "BX1207",
            "error": "Product already reviewed."
        }, 400, {"Content-Type": "application/json"}
    
    if not isinstance(rating, (int, float)):
        return {
            "error_code": "BX4001",
            "error": "Invalid rating."
        }, 400, {"Content-Type": "application/json"}

    if rating < 1 or rating > 5:
        return {
            "error_code": "BX4001",
            "error": "Invalid rating."
        }, 400, {"Content-Type": "application/json"}
    
    if not isinstance(comment, str):
        return {
            "error_code": "BX4002",
            "error": "Invalid comment."
        }, 400, {"Content-Type": "application/json"}
        
    if len(comment) > 3000:
        return {
            "error_code": "BX4003",
            "error": "Comment is too long."
        }, 400, {"Content-Type": "application/json"}
    
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    sql = """\
INSERT INTO reviews (productId, authorId, rating, comment)
VALUES (%s, %s, %s, %s)"""

    cursor.execute(sql, (pid, uid, rating, comment))
    db_conn.commit()
    
    return {
        "message": "Review added."
    }, 201, {"Content-Type": "application/json"}
    
@reviews_api.get("/reviews/<pid>/me")
@limiter.limit("10/minute") 
@token_required
def get_my_review(uid, pid):
    if len(pid) != 43:
        return {
            "error_code": "BX1205",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
        
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    cursor.execute("""\
SELECT r.id, r.rating, r.comment
FROM reviews AS r
WHERE r.productId = %s AND r.authorId = %s""", (pid, uid))
    result = cursor.fetchone()
    cursor.close()
    
    if result is None:
        return {
            "error_code": "BX1207",
            "error": "Review doesn't exist."
        }, 400, {"Content-Type": "application/json"}
    
    return result, 200, {"Content-Type": "application/json"}

@reviews_api.patch("/reviews/<pid>/<rid>")
@limiter.limit("10/minute")
@token_required
def edit_review(uid, pid, rid):
    data = request.get_json()
    rating = data["rating"]
    comment = data["comment"]
    
    if len(pid) != 43:
        return {
            "error_code": "BX1205",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
        
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    cursor.execute("SELECT * FROM reviews WHERE id = %s", (rid,))
    result = cursor.fetchone()
    cursor.close()
    
    if result is None:
        return {
            "error_code": "BX1207",
            "error": "Review doesn't exist."
        }, 400, {"Content-Type": "application/json"}

    if result["authorId"] != uid:
        return {
            "error_code": "BX1208",
            "error": "You can't edit this review."
        }, 403, {"Content-Type": "application/json"}
        
    if not isinstance(rating, (int, float)):
        return {
            "error_code": "BX4001",
            "error": "Invalid rating."
        }, 400, {"Content-Type": "application/json"}
        
    if rating < 1 or rating > 5:
        return {
            "error_code": "BX4001",
            "error": "Invalid rating."
        }, 400, {"Content-Type": "application/json"}
        
    if not isinstance(comment, str):
        return {
            "error_code": "BX4002",
            "error": "Invalid comment."
        }, 400, {"Content-Type": "application/json"}
        
    if len(comment) > 3000:
        return {
            "error_code": "BX4003",
            "error": "Comment is too long."
        }, 400, {"Content-Type": "application/json"}
        
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    sql = """\
UPDATE reviews
SET rating = %s, comment = %s
WHERE id = %s"""

    cursor.execute(sql, (rating, comment, rid))
    db_conn.commit()
    
    return {
        "message": "Review edited."
    }, 200, {"Content-Type": "application/json"}
    
@reviews_api.delete("/reviews/<pid>/<rid>")
@limiter.limit("10/minute")
@token_required
def delete_review(uid, pid, rid):
    if len(pid) != 43:
        return {
            "error_code": "BX1205",
            "error": "Invalid product id."
        }, 400, {"Content-Type": "application/json"}
        
    db_conn = Global.db_conn
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    cursor.execute("SELECT * FROM reviews WHERE id = %s", (rid,))
    result = cursor.fetchone()
    cursor.close()
    
    if result is None:
        return {
            "error_code": "BX1207",
            "error": "Review doesn't exist."
        }, 400, {"Content-Type": "application/json"}
    
    # the user is either the author or an admin
    if result["authorId"] != uid and not User.is_admin(uid):
        return {
            "error_code": "BX1208",
            "error": "You can't delete this review."
        }, 403, {"Content-Type": "application/json"}
       
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    cursor.execute("DELETE FROM reviews WHERE id = %s", (rid,))
    db_conn.commit()
    
    return {
        "message": "Review deleted."
    }, 200, {"Content-Type": "application/json"}