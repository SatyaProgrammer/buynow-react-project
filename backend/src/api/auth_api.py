from flask import Blueprint, request
from backend.src.lib import Globals

auth_api = Blueprint('auth_api', __name__)

@auth_api.post("/auth/login")
def login():
    request_data = request.get_json()
    name = request_data["username"]
    password = request_data["password"]
    
    Globals.console.print(f"[green]Username: {name}[/green]")
    Globals.console.print(f"[red]Password: {password}[/red]")