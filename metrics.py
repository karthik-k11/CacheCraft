def calculate_metrics(total_requests, hits, misses, evictions):
    if total_requests == 0:
        hit_ratio = 0
        miss_ratio = 0
    else:
        hit_ratio = hits / total_requests
        miss_ratio = misses / total_requests

    return {
        "total_requests": total_requests,
        "hits": hits,
        "misses": misses,
        "evictions": evictions,
        "hit_ratio": hit_ratio,
        "miss_ratio": miss_ratio
    }