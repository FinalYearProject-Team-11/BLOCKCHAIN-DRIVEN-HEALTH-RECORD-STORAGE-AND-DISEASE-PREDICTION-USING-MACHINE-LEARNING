import base64
from io import BytesIO
from PIL import Image
import numpy as np
from flask import Flask, request, jsonify
from deepface import DeepFace

app = Flask(__name__)

# Dummy database to store user embeddings
user_embeddings = {}


@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    image_base64 = data['image'].split(",")[1]  # Extract base64 string
    image_data = base64.b64decode(image_base64)

    # Process image
    image = Image.open(BytesIO(image_data))
    image_np = np.array(image)  # Convert PIL image to numpy array
    detected_face = DeepFace.detectFace(image_np, enforce_detection=False)
    if detected_face is None:
        return jsonify({"message": "Face could not be detected in the image"}), 400

    embeddings = DeepFace.represent(detected_face, model_name='Facenet512')

    # Store user embeddings
    user_embeddings[image_base64] = embeddings.tolist()

    return jsonify({"message": "User registered successfully"})


@app.route('/authenticate', methods=['POST'])
def authenticate_user():
    data = request.get_json()
    image_base64 = data['image'].split(",")[1]  # Extract base64 string
    image_data = base64.b64decode(image_base64)

    # Process image
    image = Image.open(BytesIO(image_data))
    image_np = np.array(image)  # Convert PIL image to numpy array
    detected_face = DeepFace.detectFace(image_np, enforce_detection=False)
    if detected_face is None:
        return jsonify({"message": "Face could not be detected in the image"}), 400

    embeddings = DeepFace.represent(detected_face, model_name='Facenet512')

    # Compare with stored embeddings
    for stored_uri, stored_embeddings in user_embeddings.items():
        result = DeepFace.verify(embeddings, stored_embeddings)
        if result['verified']:
            return jsonify({"message": "User authenticated successfully"})

    return jsonify({"message": "Authentication failed"}), 401


if __name__ == '__main__':
    app.run(debug=True)
