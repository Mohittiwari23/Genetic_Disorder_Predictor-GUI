import uvicorn
from fastapi import FastAPI
import numpy as np
import joblib
import pandas as pd

np.random.seed(42)

app = FastAPI()
label_encoder = joblib.load('label_encoders.pkl')
pca = joblib.load('pca.pkl')
xgb_classifier = joblib.load('xgb_model.pkl')

input_dict = {
    "RBC_count": 4.760603,
    "status": "Alive",
    "follow_up": "High",
    "gender": "Missing",
    "folic_acid_supplement": "No",
    "assisted_conception": "No",
    "white_blood_cell_count": 9.857562,
    "blood_test_result": "slightly abnormal",
    "symptom_total": 5,
    "genetic_risk": 1,
    "patient_age": 1,
    "vital_status": "Normal",
    "birth_complications": 1,
    "maternal_risk_factors": 1,
    "pregnancy_history": 1
}

df = pd.DataFrame([input_dict])
numerical_cols = df.select_dtypes(include=["number"]).columns
categorical_cols = df.select_dtypes(include=["object"]).columns

for col in categorical_cols:
    df[col] = label_encoder.fit_transform(df[col])

df['age_group'] = pd.cut(df['patient_age'], bins=[0, 2, 12, 18], labels=[0, 1, 2])

df['age_group_infant'] = 0
df['age_group_child'] = 0
df['age_group_adolescent'] = 0
df['age_group_nan'] = 0

df.loc[df['age_group'] == 0, 'age_group_infant'] = 1
df.loc[df['age_group'] == 1, 'age_group_child'] = 1
df.loc[df['age_group'] == 2, 'age_group_adolescent'] = 1
df.loc[df['age_group'].isna(), 'age_group_nan'] = 1

df.drop(columns=['age_group','patient_age'], inplace=True)

df_final = pca.transform(df)

proba = xgb_classifier.predict_proba(df_final)
predicted_class = np.argmax(proba, axis=1)[0]
class_labels = {
    0: "Mitochondrial genetic inheritance disorder",
    1: "Multifactorial genetic inheritance disorder",
    2: "Single-gene inheritance diseases"
}


print("Class Probabilities:")
for i, p in enumerate(proba[0]):
    print(f"{class_labels[i]}: {p * 100:.2f}%")

print(f"\nMost Likely Prediction: {class_labels[predicted_class]} ({predicted_class})")
