from backend.src.lib.passwd import make_password

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python makepass.py <password>")
        return
    
    passwd = sys.argv[1]
    
    hashed, salt = make_password(passwd)
    
    print(f"{salt}${hashed}")

if __name__ == "__main__":
    main()