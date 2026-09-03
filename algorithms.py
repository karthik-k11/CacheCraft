from cache import Cache


class LRUCache(Cache):
    def access(self, key):
        evicted = None

        if self.contains(key):
            self.items.move_to_end(key)
            hit = True

        else:
            hit = False

            if self.is_full():
                evicted, _ = self.items.popitem(last=False)

            self.add(key)

        return {
            "request": key,
            "hit": hit,
            "evicted": evicted,
            "cache": self.get_items()
        }


class FIFOCache(Cache):
    def access(self, key):
        evicted = None

        if self.contains(key):
            hit = True

        else:
            hit = False

            if self.is_full():
                evicted, _ = self.items.popitem(last=False)

            self.add(key)

        return {
            "request": key,
            "hit": hit,
            "evicted": evicted,
            "cache": self.get_items()
        }