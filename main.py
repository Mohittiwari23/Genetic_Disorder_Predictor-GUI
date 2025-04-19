import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
import pandas as pd
import functions as func


class InputDict(BaseModel):
    patient_age: int
    gender: str
    gene_defect_maternal: str
    gene_defect_paternal: str
    heart_rate: str
    resp_rate: str
    RBC_count: int
    WBC_count: int
    follow_up: str
    symptom_total: int
    birth_comp_asphyxia: str
    birth_comp_autopsy: str
    num_birth_defects: str
    maternal_illness_hist: str
    radiation_expo_hist: str
    substance_abuse_hist: str
    folic_acid_supplement: str
    assisted_conception: str
    prev_preg_anamolies: str
    prev_abortions: str

class OutputDict(BaseModel):
    class_0: float
    class_1: float
    class_2: float
    prediction: str

app = FastAPI()

origins = [
    "https://..."
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

label_encoder = joblib.load('label_encoders.pkl')
pca = joblib.load('pca.pkl')
xgb_classifier = joblib.load('xgb_model.pkl')



@app.post("/prediction", response_model=OutputDict)
def predict(input_data: InputDict):

    df = pd.DataFrame([input_data.dict()])

    df['genetic_risk'] = (df['gene_defect_maternal'] == 'Yes').astype(int) + (df['gene_defect_paternal'] == 'Yes').astype(int)

    df["vital_status"] = df.apply(lambda row: func.classify_vital_status(row["resp_rate"], row["heart_rate"]), axis=1)
    df["birth_complications"] = df.apply(lambda row: func.classify_birth_complications(row["birth_comp_asphyxia"], row["birth_comp_autopsy"], row["num_birth_defects"]), axis=1)
    df["maternal_risk_factors"] = df.apply(lambda row: func.classify_maternal_risk(row["maternal_illness_hist"], row["radiation_expo_hist"], row["substance_abuse_hist"]), axis=1)
    df["pregnancy_history"] = df.apply(lambda row: func.classify_pregnancy_history(row["prev_preg_anamolies"], row["prev_abortions"]), axis=1)
    df["status"] = 'Alive'
    
    df = func.drop_columns(df)
    df.reset_index(inplace=True, drop=False)

    categorical_cols = df.select_dtypes(include=["object"]).columns

    for col in categorical_cols:
        df[col] = label_encoder.fit_transform(df[col])

    if 'patient_age' not in df.columns:
        raise ValueError("Column 'patient_age' not found in input data. Found columns: " + str(df.columns.tolist()))

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

    return {
        "class_0": round(proba[0][0], 4),
        "class_1": round(proba[0][1], 4),
        "class_2": round(proba[0][2], 4),
        "prediction": class_labels[predicted_class]
    }




