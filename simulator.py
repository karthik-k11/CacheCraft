from algorithms import LRUCache


def simulate_lru(requests, capacity):
    cache = LRUCache(capacity)

    events = []
    hits = 0
    misses = 0
    evictions = 0

    for request in requests:
        event = cache.access(request)

        if event["hit"]:
            hits += 1
        else:
            misses += 1

        if event["evicted"] is not None:
            evictions += 1

        events.append(event)

    return {
        "events": events,
        "total_requests": len(requests),
        "hits": hits,
        "misses": misses,
        "evictions": evictions
    }