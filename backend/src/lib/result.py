from __future__ import annotations

from typing import Generic, TypeVar, Callable, Any

T = TypeVar('T')
U = TypeVar('U')
V = TypeVar('V')

class Result(Generic[T, U]):
    """A Result monad.
    
    You can use this class to return a value or an error.
    """
    def __init__(self, value: T, error: U):
        """Initialize a Result object.
        Do not use this constructor directly. Use the static methods Ok and Err instead.

        Args:
            value (T): The value of the result.
            error (U): The error of the result.
        """
        self.value = value
        self.error = error
    
    @staticmethod
    def ret(value: T) -> Result[T, U]:
        """Identity function for Result.
        Type: `ret :: t -> Result t u`

        Args:
            value (T): The value to return.

        Returns:
            Result[T, U]: The value wrapped in a Result.
        """
        return Result.Ok(value)

    @staticmethod
    def Ok(value: T) -> Result[T, U]:
        """Create a Result with a value.

        Args:
            value (T): The value to return.

        Returns:
            Result[T, U]: The value wrapped in a Result.
        """
        return Result(value, None)
    
    @staticmethod
    def Err(error: U) -> Result[T, U]:
        """Create a Result with an error.

        Args:
            error (U): The error to return.

        Returns:
            Result[T, U]: The error wrapped in a Result.
        """
        return Result(None, error)
    
    def is_ok(self) -> bool:
        """Check if the Result is a value.

        Returns:
            bool: True if the Result is a value, False otherwise.
        """
        return self.value is not None
    
    def is_err(self) -> bool:
        """Check if the Result is an error.

        Returns:
            bool: True if the Result is an error, False otherwise.
        """
        return self.error is not None
    
    def map(self, f: Callable[[T], Result[V, U]]) -> Result[V, U]:
        """Map a function over the Result.
        Type: `map :: Result t u -> (t -> Result v u) -> Result v u`

        Args:
            f (Callable[[T], Result[V, U]]): The function to map over the Result.

        Returns:
            Result[V, U]: The result of the function.
        """
        if self.is_ok():
            return Result.Ok(f(self.value))
        else:
            return Result.Err(self.error)
        
    def map_err(self, f: Callable[[U], Result[T, V]]) -> Result[T, V]:
        """Map a function over the error of the Result.
        Type: `map_err :: Result t u -> (u -> Result t v) -> Result t v`

        Args:
            f (Callable[[U], Result[T, V]]): The function to map over the error of the Result.

        Returns:
            Result[T, V]: The result of the function.
        """
        if self.is_err():
            return Result.Err(f(self.error))
        else:
            return Result.Ok(self.value)
        
    def bind(self, f: Callable[[T], Result[V, U]]) -> Result[V, U]:
        """An alias for :func:`<result.Result.map>`.
        Type: `bind :: Result t u -> (t -> Result v u) -> Result v u`

        Args:
            f (Callable[[T], Result[V, U]]): The function to map over the Result.

        Returns:
            Result[V, U]: The result of the function.
        """
        return self.map(f)

    def bind_err(self, f: Callable[[U], Result[T, V]]) -> Result[T, V]:
        """An alias for :func:`<result.Result.map_err>`.
        Type: `bind_err :: Result t u -> (u -> Result t v) -> Result t v`
        
        Args:
            f (Callable[[U], Result[T, V]]): The function to map over the error of the Result.
        
        Returns:
            Result[T, V]: The result of the function.
        """
        return self.map_err(f)
    
    def unwrap(self) -> T:
        """Unwrap the Result.
        If the Result is an error, raise the error.

        Returns:
            T: The value of the Result.

        Raises:
            U: The error of the Result.
        """
        if self.is_ok():
            return self.value
        else:
            raise self.error
        
    def unwrap_err(self) -> U:
        """Unwrap the error of the Result.
        If the Result is a value, raise the value.

        Returns:
            U: The error of the Result.

        Raises:
            T: The value of the Result.
        """
        if self.is_err():
            return self.error
        else:
            raise self.value
        
    def unwrap_or(self, default: T) -> T:
        """Unwrap the Result or return a default value.
        If the Result is an error, return the default value.
        
        For FP programmers, this is a strict function. The lazy version is :func:`<result.Result.unwrap_or_else>`.

        Args:
            default (T): The default value to return.

        Returns:
            T: The value of the Result or the default value.
        """
        if self.is_ok():
            return self.value
        else:
            return default
        
    def unwrap_or_else(self, f: Callable[[U], T]) -> T:
        """Unwrap the Result or return the result of a function.
        If the Result is an error, return the result of the function.
        
        For FP programmers, this is a lazy function. The strict version is :func:`<result.Result.unwrap_or>`.

        Args:
            f (Callable[[Any], T]): The function to call.

        Returns:
            T: The value of the Result or the result of the function.
        """
        if self.is_ok():
            return self.value
        else:
            return f(self.error)
        
    def __str__(self):
        if self.is_ok():
            return f"Ok({self.value})"
        else:
            return f"Err({self.error})"
        
    def __repr__(self):
        if self.is_ok():
            return f"Result.Ok(value={self.value},error=None)"
        else:
            return f"Result.Err(value=None,error={self.error})"