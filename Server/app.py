from flask import Flask, request, jsonify, g
import pickle
from flask_cors import CORS
import os
import cv2
import numpy as np
import sqlite3
import uuid
import base64

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

DATABASE = 'users.db'
UPLOAD_FOLDER_REGISTRATION = 'registration_images'
UPLOAD_FOLDER_AUTHENTICATION = 'authentication_images'

# Create upload folders if they don't exist
os.makedirs(UPLOAD_FOLDER_REGISTRATION, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_AUTHENTICATION, exist_ok=True)

# Load pre-trained face detection model
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
face_recognizer = cv2.face.LBPHFaceRecognizer_create()


# Function to get a database connection
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


# Function to close the database connection
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Function to generate a unique fingerprint
def generate_fingerprint():
    return str(uuid.uuid4())

# Function to save base64 encoded image to file
def save_image_from_base64(image_base64, folder):
    _, encoded = image_base64.split(",", 1)
    decoded_image = base64.b64decode(encoded)
    filename = f"{uuid.uuid4()}.png"
    filepath = os.path.join(folder, filename)
    with open(filepath, "wb") as f:
        f.write(decoded_image)
    return filepath

# Function to get the next available user ID
def get_next_user_id():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT MAX(id) FROM users")
    result = cursor.fetchone()
    if result[0] is not None:
        return result[0] + 1
    else:
        return 1  # If there are no users yet, start from 1

def create_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users
                      (id INTEGER PRIMARY KEY, name TEXT, fingerprint TEXT)''')
    conn.commit()
    conn.close()


create_database()


@app.route('/lung_cancer', methods=["POST"])
def lung_cancer():
    try:
        lung_cancer_model = pickle.load(open("lung_cancer_model.pkl", "rb"))
        data = request.json
        features = [
            int(data.get('age', 0)),
            int(data.get('SMOKING', 0)),
            int(data.get('"YELLOW_FINGERS"', 0)),
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


# Register User API endpoint
@app.route('/register', methods=['POST'])
def register_user():
    name = request.json.get('name')
    image_base64 = request.json.get('image')

    # Save image to file
    image_path = save_image_from_base64(image_base64, UPLOAD_FOLDER_REGISTRATION)

    # Read image file
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) != 1:
        return jsonify({'error': 'Could not detect a single face in the image'}), 400

    # Extract features from the detected face
    (x, y, w, h) = faces[0]
    face_roi = gray[y:y+h, x:x+w]

    # Assign a unique label based on user ID
    user_id = get_next_user_id()  # Implement this function to generate unique user IDs
    labels = [user_id]

    # Train the face recognizer with the extracted face features
    face_recognizer.train([face_roi], np.array(labels))

    # Generate a unique fingerprint for the user
    fingerprint = generate_fingerprint()

    # Insert the user into the database with assigned user ID
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO users (id, name, fingerprint) VALUES (?, ?, ?)", (user_id, name, fingerprint))
    db.commit()

    return jsonify({
        'message': 'User registered successfully',
        'fingerprint': fingerprint
    })

# Authenticate User API endpoint
@app.route('/authenticate', methods=['POST'])
def authenticate_user():
    image_base64 = request.json.get('image')

    # Save image to file
    image_path = save_image_from_base64(image_base64, UPLOAD_FOLDER_AUTHENTICATION)

    # Read image file
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) != 1:
        return jsonify({'error': 'Could not detect a single face in the image'}), 400

    # Extract features from the detected face
    (x, y, w, h) = faces[0]
    face_roi = gray[y:y+h, x:x+w]

    # Use the trained face recognizer to predict the label of the input face
    label, confidence = face_recognizer.predict(face_roi)

    # Set a threshold for face recognition confidence
    threshold = 70
    if confidence < threshold:
        # Check if the recognized user is in the database
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT name, fingerprint FROM users WHERE id = ?", (label,))
        user = cursor.fetchone()
        if user:
            name, fingerprint = user
            return jsonify({'message': f'User authenticated successfully: {name}', 'fingerprint': fingerprint})
        else:
            return jsonify({'error': 'Authentication failed: User not recognized'}), 401
    else:
        return jsonify({'error': 'Authentication failed: Face not recognized'}), 401

if __name__ == '__main__':
    app.run()
