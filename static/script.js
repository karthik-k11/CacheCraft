const simulateButton = document.getElementById("simulate-button");
const compareButton = document.getElementById("compare-button");

const startStepButton = document.getElementById("start-step-button");
const nextStepButton = document.getElementById("next-step-button");
const resetStepButton = document.getElementById("reset-step-button");


let stepEvents = [];
let currentStep = 0;


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


startStepButton.addEventListener("click", async function () {
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


    statusElement.textContent =
        "Preparing step-by-step simulation...";


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


        stepEvents = result.events;
        currentStep = 0;


        displayStep();


        nextStepButton.disabled = false;
        resetStepButton.disabled = false;
        startStepButton.disabled = true;


        statusElement.textContent =
            `${algorithm} step-by-step simulation started.`;


    } catch (error) {
        console.error(error);

        statusElement.textContent =
            "Unable to connect to the simulation server.";
    }
});


nextStepButton.addEventListener("click", function () {
    if (currentStep >= stepEvents.length) {
        return;
    }


    currentStep++;

    displayStep();


    if (currentStep >= stepEvents.length) {
        nextStepButton.disabled = true;

        document.getElementById("simulation-status").textContent =
            "Step-by-step simulation completed.";
    }
});


resetStepButton.addEventListener("click", function () {
    stepEvents = [];
    currentStep = 0;


    document.getElementById("step-counter").textContent =
        "No step-by-step simulation running.";


    document.getElementById("step-display").innerHTML =
        "<p>Click \"Start Step-by-Step\" to begin.</p>";


    nextStepButton.disabled = true;
    resetStepButton.disabled = true;
    startStepButton.disabled = false;


    document.getElementById("simulation-status").textContent =
        "Step-by-step simulation reset.";
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


function displayStep() {
    const stepCounter = document.getElementById("step-counter");
    const stepDisplay = document.getElementById("step-display");


    if (currentStep === 0) {
        stepCounter.textContent =
            `Ready: ${stepEvents.length} requests`;

        stepDisplay.innerHTML =
            "<p>Click \"Next Step\" to process the first request.</p>";

        return;
    }


    const event = stepEvents[currentStep - 1];


    stepCounter.textContent =
        `Step ${currentStep} of ${stepEvents.length}`;


    const resultText = event.hit ? "HIT" : "MISS";


    const evictionText = event.evicted
        ? `<p><strong>Evicted:</strong> ${event.evicted}</p>`
        : "<p><strong>Evicted:</strong> None</p>";


    stepDisplay.innerHTML = `
        <p><strong>Request:</strong> ${event.request}</p>
        <p><strong>Result:</strong> ${resultText}</p>
        <p><strong>Cache:</strong> [${event.cache.join(", ")}]</p>
        ${evictionText}
    `;
}