from rich.console import Console
import os
import mysql.connector as msc
from dotenv import load_dotenv

def main():
    load_dotenv(dotenv_path=".env.local")
    
    console = Console()
    
    console.print("Checking if in venv...", end="")
    
    if os.getenv("VIRTUAL_ENV"):
        console.print(" [green]Yes[/green]")
    else:
        console.print(" [red]No[/red]")
        
    console.print("Has connection to database...", end="")
    
    try:
        db_conn = msc.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            name=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            passwd=os.getenv("DB_PASS")
        )
        console.print(" [green]Yes[/green]")
        
        console.print("Has permissions to database...", end="")
        
        cursor = db_conn.cursor()
        
        cursor.execute("SELECT * FROM users")
        
        results = cursor.fetchall()
        
        if results:
            console.print(" [green]Yes[/green]")
        else:
            console.print(" [red]No[/red]")
    except Exception as e:
        console.print(" [red]No[/red]")
        console.print(e)
        
    pass

if __name__ == '__main__':
    main()