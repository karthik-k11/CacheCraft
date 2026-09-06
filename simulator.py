from algorithms import LRUCache, FIFOCache
from metrics import calculate_metrics


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

    metrics = calculate_metrics(
        len(requests),
        hits,
        misses,
        evictions
    )

    return {
        "events": events,
        **metrics
    }


def simulate_fifo(requests, capacity):
    cache = FIFOCache(capacity)

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

    metrics = calculate_metrics(
        len(requests),
        hits,
        misses,
        evictions
    )

    return {
        "events": events,
        **metrics
    }


def compare_algorithms(requests, capacity):
    lru_result = simulate_lru(requests, capacity)
    fifo_result = simulate_fifo(requests, capacity)

    return {
        "LRU": lru_result,
        "FIFO": fifo_result
    }