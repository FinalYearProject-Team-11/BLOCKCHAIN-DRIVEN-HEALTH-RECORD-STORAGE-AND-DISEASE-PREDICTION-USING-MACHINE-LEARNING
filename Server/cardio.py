import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
import pickle

data = pd.read_csv('cardio_dataset.csv')
data = data.drop("id", axis=1)
data = data.fillna(data.mean())
for col in ['gender', 'smoke', 'alco', 'active']:
    data[col] = pd.Categorical(data[col]).codes
X = data.drop('cardio', axis=1)
y = data['cardio']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
xgb_model = xgb.XGBClassifier(
    objective='binary:logistic',
    learning_rate=0.1,
    n_estimators=100,
    max_depth=5,
    gamma=0.2,
    subsample=0.8,
    colsample_bytree=0.8
)
xgb_model.fit(X_train, y_train)
y_pred = xgb_model.predict(X_test)
pickle.dump(xgb_model, open('cardio_model.pkl', 'wb'))
accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred)
print("Accuracy:", accuracy)
print("ROC AUC:", roc_auc)
feature_importances = pd.DataFrame({'feature': X.columns, 'importance': xgb_model.feature_importances_})
print(feature_importances.sort_values(by='importance', ascending=False))
