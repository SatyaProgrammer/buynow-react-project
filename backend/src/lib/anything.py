from typing import Type

def true(__x: str | int) -> bool:
    return not false(__x)

def false(__x: str | int) -> bool:
    return __x in [0, "0", "false", "False", "FALSE", False, [], set(), dict()]

class ProtocolNotSatisfied(Exception):
    def __init__(self, protocol: str, cls: Type, func: str):
        self.protocol = protocol
        self.cls = cls
        self.func = func
    
    def __str__(self) -> str:
        return f"Protocol {self.protocol} not satisfied by {self.cls.__name__} (missing {self.func})"