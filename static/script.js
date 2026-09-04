const simulateButton = document.getElementById("simulate-button");


simulateButton.addEventListener("click", async function () {
    const requestSequence = document.getElementById("request-sequence").value;

    const cacheCapacity = Number(
        document.getElementById("cache-capacity").value
    );

    const algorithm = document.getElementById("algorithm").value;

    const statusElement = document.getElementById("simulation-status");


    if (requestSequence.trim() === "") {
        statusElement.textContent = "Please enter a request sequence.";
        return;
    }


    if (cacheCapacity < 1) {
        statusElement.textContent = "Cache capacity must be at least 1.";
        return;
    }


    const requests = requestSequence
        .split(",")
        .map(request => request.trim())
        .filter(request => request !== "");


    if (requests.length === 0) {
        statusElement.textContent = "Please enter valid requests.";
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