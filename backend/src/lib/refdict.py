from expiringdict import ExpiringDict


class RefreshingDict:
    def __init__(
        self, max_age_seconds: int = 60, max_len: int = 1000, items: dict = None
    ):
        self._dict = ExpiringDict(max_len, max_age_seconds, items)

    def __getitem__(self, key):
        value = self._dict[key]
        if value is not None:
            self._dict[key] = value

        return value

    def get(self, key, default=None):
        value = self._dict.get(key, default)
        if value is not None:
            self._dict[key] = value

        return value

    def __setitem__(self, key, value):
        self._dict[key] = value

    def pop(self, key):
        return self._dict.pop(key)
