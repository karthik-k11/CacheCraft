from flask import Flask, jsonify, render_template, request

from simulator import simulate_lru


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/simulate", methods=["POST"])
def simulate():
    data = request.get_json()

    requests = data.get("requests", [])
    capacity = data.get("capacity")
    algorithm = data.get("algorithm")

    if not isinstance(requests, list) or not requests:
        return jsonify({"error": "Request sequence cannot be empty."}), 400

    if not isinstance(capacity, int) or capacity < 1:
        return jsonify({"error": "Cache capacity must be at least 1."}), 400

    if algorithm != "LRU":
        return jsonify({"error": "Only LRU is available in this milestone."}), 400

    result = simulate_lru(requests, capacity)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)