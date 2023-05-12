from typing import Protocol
from backend.src.lib import ProtocolNotSatisfied
class Model(Protocol):
    """Model protocol.
    
    Trait methods:
        ClassMethod:
            fetch_matching(cls, __taking: list[str], __cond: dict[str, str]) -> list[dict[str]]
            fetch_all(cls, __taking: list[str]) -> list[dict[str]]
            id(cls, __id: str | int) -> dict[str])"""
    @classmethod
    def fetch_matching(cls, __taking: list[str], __cond: dict[str, str]) -> list[dict[str]]:
        raise ProtocolNotSatisfied("Model", cls, "fetch_matching")

    @classmethod
    def fetch_all(cls, __taking: list[str]) -> list[dict[str]]:
        raise ProtocolNotSatisfied("Model", cls, "fetch_all")
    
    @classmethod
    def id(cls, __id: str | int) -> dict[str]:
        raise ProtocolNotSatisfied("Model", cls, "id")