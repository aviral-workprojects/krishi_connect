from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    return jsonify({
        "recommended_crop": "Wheat",
        "input_received": data
    })

@app.route("/trends", methods=["GET"])
def trends():
    return jsonify({
        "top_crops": ["Rice", "Wheat", "Maize"],
        "demand_index": {"Rice": 0.9, "Wheat": 0.8, "Maize": 0.7}
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
