import os
import re
import mysql.connector as msc
from argparse import ArgumentParser
from rich.console import Console
from dotenv import load_dotenv
from importlib import import_module

from backend.src.utils.reserved.reserved_keywords import RESERVED
from backend.src.utils.table import MigratorQueue

load_dotenv(dotenv_path=".env.local")
console = Console()

def is_digits(s: str) -> bool:
    m = re.match(r"\d+", s)
    if m is None:
        return False
    return m.groups(0) == s

def create_migration_file(table_name: str):
    if len(table_name) > 32:
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        return
    
    if any(x in table_name for x in ['$', ' ', '/', '.']):
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        return
    
    if is_digits(table_name):
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        return
    
    if table_name in RESERVED:
        console.print("[red]Not creating migration file.[/red]")
        console.print_exception()
        return
    
    filename = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations", "migration_" + table_name + ".py")
    
    content = f"""from backend.src.utils.table import Table
import mysql.connector as msc

# don't change this variable name
TABLE_NAME = "{table_name}"

def up():
    table = Table(name=TABLE_NAME)
    table.int(name="id").primary_key()
    table.migrate()
    
def down(db_conn: msc.MySQLConnection):
    Table(name=TABLE_NAME).drop(db_conn)
"""

    with open(filename, 'w') as f:
        f.write(content)
        
    console.print("[green]Created migration file.[/green]")
    
def rollback_database(db_conn: msc.MySQLConnection) -> None:
    try:
        cursor = db_conn.cursor()
        query = "SELECT id, name, table_name, batch_id, order_id FROM migrations_log as m HAVING m.batch_id = MAX(m.batch_id)"
        cursor.execute(query)
        result = cursor.fetchall()
    
        rollbacks = sorted(result, key=lambda x: x[4], reverse=True)
        
        for rollback in rollbacks:
            console.print(f"[green]Rolling back {rollback[2]}[/green]")
            service = import_module(f"backend.migrations.{rollback[1]}")
            service.down(db_conn)
            rmquery = "DELETE FROM migrations_log WHERE id = %s"
            cursor.execute(rmquery, (rollback[0],))
            cursor.fetchall()
        
        cursor.close()
        db_conn.commit()
        
        console.print("[green]Rolled back database.[/green]")
    except Exception as e:
        console.print("[red]Failed to rollback database.[/red]")
        console.print_exception()
        return
    
def migrate_database(db_conn: msc.MySQLConnection) -> None:
    # get all migration files
    migrations = os.listdir(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations"))
    # names = []
    try:
        for migration in migrations:
            if migration.endswith(".py"):
                service = import_module(f"backend.migrations.{migration[:-3]}")
                # names.append(service.TABLE_NAME)
                service.up()
    except Exception as e:
        console.print("[red]Failed to migrate database.[/red]")
        console.print_exception()
        return
            
    result = MigratorQueue.commit(db_conn)
    if result.is_err():
        console.print("[red]Failed to migrate database.[/red]")
        console.print(f"Why: {result.unwrap_err()}")
        return
    
    console.print("[green]Migrated database.[/green]")
    
def main() -> None:
    if not os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations")):
        os.mkdir(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "migrations"))
    
    ap = ArgumentParser(description="Python database migrator.")
    ap.add_argument('-n', '--new', action='store', help='create a new migration file')
    ap.add_argument('-r', '--rollback', action='store_true', help='drop the database')
    
    args = vars(ap.parse_args())
    
    try:
        db_conn = msc.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            user=os.getenv('DB_USER'),
            passwd=os.getenv('DB_PASS'),
            db=os.getenv('DB_NAME')
        )
    except Exception as e:
        console.print("[red]Failed to create a database connection, not even trying.[/red]")
        console.print_exception()
        return
        
    if args['new']:
        create_migration_file(args.get('new'))
        return
    
    if args['rollback']:
        rollback_database(db_conn)
        return
        
    migrate_database(db_conn)
    pass

if __name__ == '__main__':
    main()