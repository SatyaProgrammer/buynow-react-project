from time import sleep

import schedule
from dotenv import load_dotenv
from rich.console import Console

from backend.src.lib.db import create_connection

load_dotenv(dotenv_path=".env.local")

console = Console()

def update_ratings():
    try:
        db_conn = create_connection()
        if db_conn.is_ok():
            db_conn = db_conn.unwrap()
        else:
            raise Exception(db_conn.unwrap_err())

        cursor = db_conn.cursor(prepared=True, dictionary=True)
        sql = """\
SELECT p.id, AVG(r.rating) as rating
FROM products p
LEFT JOIN reviews r ON p.id = r.productId
GROUP BY p.id"""
        cursor.execute(sql)

        for row in cursor.fetchall():
            cursor.execute(
                """\
UPDATE products
SET rating = ?
WHERE id = ?""",
                (row["rating"], row["id"]),
            )

        db_conn.commit()
        cursor.close()

        console.log("[bold green]Updated ratings[/bold green]")
    except Exception as e:
        console.print_exception()
        exit(1)
        

def schedule_stuffs():
    schedule.every(5).minutes.do(update_ratings)
    console.log("[bold green]Scheduled stuffs[/bold green]")

def main():
    schedule_stuffs()
    schedule.run_all()

    while True:
        schedule.run_pending()
        sleep(1)

if __name__ == "__main__":
    main()

