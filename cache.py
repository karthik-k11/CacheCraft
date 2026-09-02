from collections import OrderedDict


class Cache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.items = OrderedDict()

    def contains(self, key):
        return key in self.items

    def get_items(self):
        return list(self.items.keys())

    def add(self, key):
        self.items[key] = None

    def remove(self, key):
        if key in self.items:
            del self.items[key]

    def is_full(self):
        return len(self.items) >= self.capacity