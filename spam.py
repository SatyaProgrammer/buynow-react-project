import asyncio
from backend.src.lib.db import create_connection
from dotenv import load_dotenv
from requests import Session, Request
load_dotenv(".env.local")

conn = create_connection()
if conn.is_err():
    raise Exception("Cannot create a database connection")

db_conn = conn.unwrap()

def get_customers(uid):
    # get total customers
    cursor = db_conn.cursor(prepared=True, dictionary=True)
    query = """SELECT COUNT(*) as total_count, COUNT(DISTINCT t.userId) as unique_count
FROM trackings as t
LEFT JOIN orders as o ON t.id = o.trackingNumber
LEFT JOIN products as p ON o.productId = p.id
WHERE p.owner = ?;"""
    
    cursor.execute(query, (uid,))
    result = cursor.fetchone()
    cursor.close()
    
    return {
        "total_customers": result["total_count"],
        "unique_customers": result["unique_count"]
    }, 200, {"Content-Type": "application/json"}

async def main():
    data = Session().post("http://api.localhost/auth/login", json={
        "username": "reimu",
        "password": "hakurei"
    })
    token = data.json()["token"]
    
    async def dumb_function():
        return Session().get("http://api.localhost/products/matching?limit=-1")
    async with asyncio.TaskGroup() as tg:
        v = [None] * 100
        for i in range(100):
            v[i] = tg.create_task(dumb_function())
        print("done")
    
    categories = Session().get("http://api.localhost/products/matching?limit=-1")
    print(categories.json())
    # my_products = Session().get("http://api.localhost/products/me", headers={
    #     "Authorization": f"Basic {token}"
    # })
    # print(my_products.json())
        
if __name__ == "__main__":
    asyncio.run(main())