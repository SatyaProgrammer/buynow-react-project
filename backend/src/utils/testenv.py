from rich.console import Console
import os
from dotenv import load_dotenv
from backend.src.lib.db import create_connection, execute_query, destroy_connection

def main():
    load_dotenv(dotenv_path=".env.local")
    
    console = Console()
    
    console.print("Checking if in venv...", end="")
    
    if os.getenv("VIRTUAL_ENV"):
        console.print(" [green]Yes[/green]")
    else:
        console.print(" [red]No[/red]")
        
    console.print("Has connection to database...", end="")
    
    db_conn = create_connection()
    if db_conn.is_err():
        console.print(" [red]No[/red]")
        console.print(f"Why: {db_conn.unwrap_err()}")
        return
    
    db_conn = db_conn.unwrap()
    query = "SELECT * FROM users"
    result = execute_query(query, db_conn)
    if result.is_ok():
        console.print(" [green]Yes[/green]")
    else:
        console.print(" [red]No[/red]")
        console.print(f"Why: {result.unwrap_err()}")
    pass

if __name__ == '__main__':
    main()