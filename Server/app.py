from flask import Flask, jsonify, request
import pickle
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins='http://localhost:3000')


@app.route('/lung_cancer', methods=["POST"])
def lung_cancer():
    try:
        lung_cancer_model = pickle.load(open("lung_cancer_model.pkl", "rb"))
        data = request.json
        features = [
            int(data.get('age', 0)),
            int(data.get('SMOKING', 0)),
            int(data.get('YELLOW_FINGERS', 0)),
            int(data.get('ANXIETY', 0)),
            int(data.get('PEER_PRESSURE', 0)),
            int(data.get('CHRONIC_DISEASE', 0)),
            int(data.get('FATIGUE', 0)),
            int(data.get('ALLERGY', 0)),
            int(data.get('WHEEZING', 0)),
            int(data.get('ALCOHOL_CONSUMING', 0)),
            int(data.get('COUGHING', 0)),
            int(data.get('SHORTNESS_OF_BREATH', 0)),
            int(data.get('SWALLOWING_DIFFICULTY', 0)),
            int(data.get('CHEST_PAIN', 0)),
        ]
        new_predictions = lung_cancer_model.predict([features])
        return jsonify({"predictions": new_predictions.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/cardio_disease', methods=["Post"])
def cardio_disease():
    try:
        cardio_model = pickle.load(open("cardio_model.pkl", "rb"))
        data = request.json
        features = [
            int(data.get('age', 0) * 365.24),
            int(data.get('GENDER', 0)),
            int(data.get('height', 0)),
            int(data.get('weight', 0)),
            int(data.get('Diastolic_BP', 0)),
            int(data.get('Systolic_BP', 0)),
            int(data.get('cholesterol', 0)),
            int(data.get('gluc', 0)),
            int(data.get('SMOKING', 0)),
            int(data.get('ALCOHOL_CONSUMING', 0)),
            int(data.get('active', 0)),
        ]
        new_predictions = cardio_model.predict([features])
        return jsonify({"predictions": new_predictions.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run()
