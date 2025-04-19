import pandas as pd

def classify_vital_status(resp_rate, heart_rate):
    if resp_rate == "Tachypnea" and heart_rate == "Tachycardia":
        return "Severely Elevated"
    elif resp_rate == "Tachypnea" or heart_rate == "Tachycardia":
        return "Elevated"
    else:
        return "Normal"

def classify_birth_complications(asphyxia, autopsy, defects):
    if asphyxia == "Yes" or autopsy == "Yes" or defects in ["Singular", "Multiple"]:
        return 1
    return 0

def classify_maternal_risk(illness, radiation, substance):
    if illness == "Yes" or radiation == "Yes" or substance == "Yes":
        return 1
    return 0

def classify_pregnancy_history(anomalies, abortions):
    if anomalies == "Yes" or abortions == "Yes":
        return 1
    return 0

def drop_columns(df):
    col_to_drop = [
        "resp_rate", "heart_rate",
        "birth_comp_asphyxia", "birth_comp_autopsy", "num_birth_defects",
        "maternal_illness_hist", "radiation_expo_hist", "substance_abuse_hist",
        "prev_preg_anamolies", "previous_abortions",
        "maternal_gene_defect", "prev_abortions",
        "gene_defect_maternal", "gene_defect_paternal",
    ]
    return df.drop(columns=col_to_drop, errors="ignore")