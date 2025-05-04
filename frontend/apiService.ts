export interface FormData {
  name: string;
  age: string;
  gender: string;
  maternalGeneDefect: string;
  paternalGeneDefect: string;
  heartRate: string;
  respiratoryRate: string;
  RBCCount: string;
  WBCCount: string;
  followup: string;
  symptoms: string;
  birthAsphyxia: string;
  autopsy: string;
  birthDefectsType: string;
  illnessHistory: string;
  radiationHistory: string;
  substanceAbuse: string;
  folicAcidSupplement: string;
  assistedConception: string;
  previousPregnancyAnomalies: string;
  previousAbortions: string;
}

export interface PredictionResponse {
  class_0: number;
  class_1: number;
  class_2: number;
  prediction: string;
}

function transformFormData(formData: FormData) {
  return {
    patient_age: Number(formData.age),
    gender: formData.gender,
    gene_defect_maternal: formData.maternalGeneDefect,
    gene_defect_paternal: formData.paternalGeneDefect,
    heart_rate: formData.heartRate,
    resp_rate: formData.respiratoryRate,
    RBC_count: parseFloat(formData.RBCCount),
    WBC_count: parseFloat(formData.WBCCount),
    follow_up: formData.followup,
    symptom_total: Number(formData.symptoms),
    birth_comp_asphyxia: formData.birthAsphyxia,
    birth_comp_autopsy: formData.autopsy,
    num_birth_defects: formData.birthDefectsType,
    maternal_illness_hist: formData.illnessHistory,
    radiation_expo_hist: formData.radiationHistory,
    substance_abuse_hist: formData.substanceAbuse,
    folic_acid_supplement: formData.folicAcidSupplement,
    assisted_conception: formData.assistedConception,
    prev_preg_anamolies: formData.previousPregnancyAnomalies,
    prev_abortions: Number(formData.previousAbortions),
  };
}

export const predictGeneticDisorder = async (formData: FormData): Promise<PredictionResponse> => {
  const transformed = transformFormData(formData);
  
  console.log("Sending transformed data:", transformed);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transformed),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Backend returned error:", errorBody);
    throw new Error("Prediction API call failed");
  }

  return await res.json();
};
