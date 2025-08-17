# ml_api/app.py
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os
import traceback

app = Flask(__name__)

# Load trained pipeline
MODEL_PATH = os.path.join("artifacts", "model.pkl")
try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Loaded ML model from {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None


@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.json
        # Expected fields: soil_type, season, rainfall_mm, temperature_c, demand_index, crop
        df = pd.DataFrame([data])

        pred_price = model.predict(df)[0]

        return jsonify({
            "predicted_price_per_kg": round(float(pred_price), 2),
            "input_received": data
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/trends", methods=["GET"])
def trends():
    try:
        # Serve predictions from sample file if available
        sample_path = os.path.join("artifacts", "sample_predictions.csv")
        if os.path.exists(sample_path):
            df = pd.read_csv(sample_path).head(10)
            return jsonify(df.to_dict(orient="records"))
        else:
            return jsonify({"error": "No sample predictions available"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)
