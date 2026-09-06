const simulateButton = document.getElementById("simulate-button");
const compareButton = document.getElementById("compare-button");


simulateButton.addEventListener("click", async function () {
    const requestSequence = document.getElementById("request-sequence").value;

    const cacheCapacity = Number(
        document.getElementById("cache-capacity").value
    );

    const algorithm = document.getElementById("algorithm").value;

    const statusElement = document.getElementById("simulation-status");


    const requests = getRequests(requestSequence, cacheCapacity);

    if (!requests) {
        return;
    }


    statusElement.textContent = "Running simulation...";


    try {
        const response = await fetch("/api/simulate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                requests: requests,
                capacity: cacheCapacity,
                algorithm: algorithm
            })
        });


        const result = await response.json();


        if (!response.ok) {
            statusElement.textContent = result.error;
            return;
        }


        displayResults(result);


        statusElement.textContent =
            `${algorithm} simulation completed successfully.`;


    } catch (error) {
        console.error(error);

        statusElement.textContent =
            "Unable to connect to the simulation server.";
    }
});


compareButton.addEventListener("click", async function () {
    const requestSequence = document.getElementById("request-sequence").value;

    const cacheCapacity = Number(
        document.getElementById("cache-capacity").value
    );

    const statusElement = document.getElementById("simulation-status");


    const requests = getRequests(requestSequence, cacheCapacity);

    if (!requests) {
        return;
    }


    statusElement.textContent =
        "Comparing LRU and FIFO...";


    try {
        const response = await fetch("/api/compare", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                requests: requests,
                capacity: cacheCapacity
            })
        });


        const result = await response.json();


        if (!response.ok) {
            statusElement.textContent = result.error;
            return;
        }


        displayComparison(result);


        statusElement.textContent =
            "LRU vs FIFO comparison completed successfully.";


    } catch (error) {
        console.error(error);

        statusElement.textContent =
            "Unable to connect to the comparison server.";
    }
});


function getRequests(requestSequence, cacheCapacity) {
    const statusElement = document.getElementById("simulation-status");


    if (requestSequence.trim() === "") {
        statusElement.textContent =
            "Please enter a request sequence.";

        return null;
    }


    if (cacheCapacity < 1) {
        statusElement.textContent =
            "Cache capacity must be at least 1.";

        return null;
    }


    const requests = requestSequence
        .split(",")
        .map(request => request.trim())
        .filter(request => request !== "");


    if (requests.length === 0) {
        statusElement.textContent =
            "Please enter valid requests.";

        return null;
    }


    return requests;
}


function displayResults(result) {
    document.getElementById("total-requests").textContent =
        result.total_requests;

    document.getElementById("hits").textContent =
        result.hits;

    document.getElementById("misses").textContent =
        result.misses;

    document.getElementById("evictions").textContent =
        result.evictions;

    document.getElementById("hit-ratio").textContent =
        `${(result.hit_ratio * 100).toFixed(2)}%`;

    document.getElementById("miss-ratio").textContent =
        `${(result.miss_ratio * 100).toFixed(2)}%`;

    displayEvents(result.events);
}


function displayEvents(events) {
    const cacheDisplay = document.getElementById("cache-display");

    cacheDisplay.innerHTML = "";


    events.forEach(event => {
        const eventElement = document.createElement("div");

        const resultText = event.hit ? "HIT" : "MISS";

        const evictionText = event.evicted
            ? ` | Evicted: ${event.evicted}`
            : "";


        eventElement.textContent =
            `Request: ${event.request} | ${resultText} | Cache: [${event.cache.join(", ")}]${evictionText}`;


        cacheDisplay.appendChild(eventElement);
    });
}


function displayComparison(result) {
    const lru = result.LRU;
    const fifo = result.FIFO;


    document.getElementById("lru-requests").textContent =
        lru.total_requests;

    document.getElementById("lru-hits").textContent =
        lru.hits;

    document.getElementById("lru-misses").textContent =
        lru.misses;

    document.getElementById("lru-hit-ratio").textContent =
        `${(lru.hit_ratio * 100).toFixed(2)}%`;

    document.getElementById("lru-miss-ratio").textContent =
        `${(lru.miss_ratio * 100).toFixed(2)}%`;

    document.getElementById("lru-evictions").textContent =
        lru.evictions;


    document.getElementById("fifo-requests").textContent =
        fifo.total_requests;

    document.getElementById("fifo-hits").textContent =
        fifo.hits;

    document.getElementById("fifo-misses").textContent =
        fifo.misses;

    document.getElementById("fifo-hit-ratio").textContent =
        `${(fifo.hit_ratio * 100).toFixed(2)}%`;

    document.getElementById("fifo-miss-ratio").textContent =
        `${(fifo.miss_ratio * 100).toFixed(2)}%`;

    document.getElementById("fifo-evictions").textContent =
        fifo.evictions;
}