import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
import pickle

data = pd.read_csv("lung_cancer_dataset.csv")  # Replace with your dataset path
data = data.drop("GENDER", axis=1)
# data = data.drop("Surname", axis=1)
# data.head


X = data.drop("LUNG_CANCER", axis=1)  # Assuming "target" column holds cancer diagnosis
y = data["LUNG_CANCER"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=100, random_state=42)  # Adjust hyperparameters as needed
rf.fit(X_train, y_train)
pickle.dump(rf, open("lung_cancer_model.pkl", "wb"))

y_pred = rf.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))