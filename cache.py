<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>CacheCraft</title>

    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>

<body>

    <main class="container">

        <header class="header">
            <h1>CacheCraft</h1>
            <p>Understand caching by seeing it in action.</p>
        </header>


        <section class="card">

            <h2>Simulation Setup</h2>

            <div class="form-group">
                <label for="request-sequence">
                    Request Sequence
                </label>

                <input
                    type="text"
                    id="request-sequence"
                    placeholder="A,B,C,A,D,B,A,E"
                >

                <small>
                    Enter requests separated by commas.
                </small>
            </div>


            <div class="form-group">
                <label for="cache-capacity">
                    Cache Capacity
                </label>

                <input
                    type="number"
                    id="cache-capacity"
                    min="1"
                    value="3"
                >
            </div>


            <div class="form-group">
                <label for="algorithm">
                    Algorithm
                </label>

                <select id="algorithm">
                    <option value="LRU">LRU</option>
                    <option value="FIFO">FIFO</option>
                </select>
            </div>


            <button id="simulate-button">
                Start Simulation
            </button>

        </section>


        <section class="card">

            <h2>Results</h2>

            <div class="metrics-grid">

                <div class="metric">
                    <span class="metric-label">Requests</span>
                    <span class="metric-value" id="total-requests">-</span>
                </div>

                <div class="metric">
                    <span class="metric-label">Hits</span>
                    <span class="metric-value" id="hits">-</span>
                </div>

                <div class="metric">
                    <span class="metric-label">Misses</span>
                    <span class="metric-value" id="misses">-</span>
                </div>

                <div class="metric">
                    <span class="metric-label">Hit Ratio</span>
                    <span class="metric-value" id="hit-ratio">-</span>
                </div>

                <div class="metric">
                    <span class="metric-label">Miss Ratio</span>
                    <span class="metric-value" id="miss-ratio">-</span>
                </div>

                <div class="metric">
                    <span class="metric-label">Evictions</span>
                    <span class="metric-value" id="evictions">-</span>
                </div>

            </div>

        </section>


        <section class="card">

            <h2>Cache State</h2>

            <div id="cache-display" class="cache-display">
                <span>No simulation running.</span>
            </div>

        </section>


        <section class="card">

            <h2>Simulation Status</h2>

            <p id="simulation-status">
                Ready to simulate.
            </p>

        </section>

    </main>


    <script src="{{ url_for('static', filename='script.js') }}"></script>

</body>
</html>