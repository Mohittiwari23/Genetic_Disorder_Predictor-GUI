// components/upload-modal.tsx
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FormData } from "@/apiService";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onOpenChange, onSubmit }) => {
  console.log("UploadModal received props:", { open, onOpenChange, onSubmit });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const heartRateOptions = ["Normal", "Tachycardia"];
  const respRateOptions = ["Normal (30-60)", "Tachypnea"];
  const followupOptions = ["Low", "High"];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "Male",
    maternalGeneDefect: "No",
    paternalGeneDefect: "No",
    heartRate: "Normal",
    respiratoryRate: "Normal (30-60)",
    RBCCount: "",
    WBCCount: "",
    symptoms: "0",
    followup: "Low",
    birthAsphyxia: "No",
    autopsy: "No",
    birthDefectsType: "Single",
    illnessHistory: "No",
    radiationHistory: "No",
    substanceAbuse: "No",
    folicAcidSupplement: "No",
    assistedConception: "No",
    previousPregnancyAnomalies: "No",
    previousAbortions: "0",
  });

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.age !== "" && +formData.age > 0 && +formData.age <= 14;
      case 3:
        return (
          formData.heartRate !== "" &&
          formData.respiratoryRate !== "" &&
          formData.RBCCount !== "" &&
          +formData.RBCCount >= 0 && +formData.RBCCount <= 10 &&
          formData.WBCCount !== "" &&
          +formData.WBCCount >= 0 && +formData.WBCCount <= 10 &&
          formData.symptoms !== "" &&
          +formData.symptoms >= 0 && +formData.symptoms <= 5 &&
          formData.followup !== ""
        );
      case 6:
        return (
          formData.previousAbortions !== "" &&
          +formData.previousAbortions >= 0 && +formData.previousAbortions <= 6
        );
      default:
        return true;
    }
  };

  const handleNext = (): void => {
    if (validateStep() && step < 6) setStep(prev => prev + 1);
  };

  const handlePrev = (): void => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (typeof onSubmit !== "function") {
        throw new Error("onSubmit is not a function");
      }

      await onSubmit(formData);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to process data. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderYesNoToggle = (field: keyof FormData, label: string) => (
    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
      <label className="text-gray-600 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">No</span>
        <Switch
          checked={formData[field] === "Yes"}
          onCheckedChange={val => handleChange(field, val ? "Yes" : "No")}
          className="h-5 w-9"
        />
        <span className="text-xs text-gray-500">Yes</span>
      </div>
    </div>
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Patient Data Form</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-600 hover:text-gray-800">✖</button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-grow space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-gray-600">Name (optional)</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <label className="block text-gray-600">Age * (1–14)</label>
              <input
                type="number"
                min={1}
                max={14}
                value={formData.age}
                onChange={e => handleChange("age", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              
              <label className="block text-gray-600">Gender *</label>
              <RadioGroup value={formData.gender} onValueChange={val => handleChange("gender", val)}>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map(g => (
                    <div key={g} className="flex items-center gap-2">
                      <RadioGroupItem value={g} />
                      <label>{g}</label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Gene Defects</h3>
              {renderYesNoToggle('maternalGeneDefect', 'Maternal Gene Defect? *')}
              {renderYesNoToggle('paternalGeneDefect', 'Paternal Gene Defect? *')}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Vitals</h3>
              <label className="block text-gray-600">Heart Rate *</label>
              <RadioGroup value={formData.heartRate} onValueChange={val => handleChange("heartRate", val)}>
                <div className="flex gap-4 flex-wrap">
                  {heartRateOptions.map(option => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <label className="block text-gray-600">Respiratory Rate *</label>
              <RadioGroup value={formData.respiratoryRate} onValueChange={val => handleChange("respiratoryRate", val)}>
                <div className="flex gap-4 flex-wrap">
                  {respRateOptions.map(option => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <label className="block text-gray-600">RBC Count (0-10 million/µL)</label>
              <input
                type="number"
                value={formData.RBCCount}
                onChange={e => handleChange("RBCCount", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <label className="block text-gray-600">WBC Count (0-10 thousand/µL)</label>
              <input
                type="number"
                value={formData.WBCCount}
                onChange={e => handleChange("WBCCount", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <label className="block text-gray-600">Number of Symptoms (0-5)</label>
              <input
                type="number"
                min={0}
                max={5}
                value={formData.symptoms}
                onChange={e => handleChange("symptoms", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <label className="block text-gray-600">Follow-up *</label>
              <RadioGroup value={formData.followup} onValueChange={val => handleChange("followup", val)}>
                <div className="flex gap-4 flex-wrap">
                  {followupOptions.map(option => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} />
                      <label>{option}</label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Birth Conditions</h3>
              {renderYesNoToggle('birthAsphyxia', 'Asphyxia?')}
              {renderYesNoToggle('autopsy', 'Autopsy?')}
              <label className="block text-gray-600">Birth Defects *</label>
              <RadioGroup value={formData.birthDefectsType} onValueChange={val => handleChange("birthDefectsType", val)}>
                <div className="flex gap-4">
                  {["Single", "Multiple"].map(opt => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Maternal Risks</h3>
              {renderYesNoToggle('illnessHistory', 'Illness History?')}
              {renderYesNoToggle('radiationHistory', 'Radiation Exposure?')}
              {renderYesNoToggle('substanceAbuse', 'Substance Abuse?')}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Pregnancy History</h3>
              {renderYesNoToggle('folicAcidSupplement', 'Folic Acid Supplement?')}
              {renderYesNoToggle('assistedConception', 'Assisted Conception?')}
              {renderYesNoToggle('previousPregnancyAnomalies', 'Previous Pregnancy Anomalies?')}
              <label className="block text-gray-600">Previous Abortions (0-6)</label>
              <input
                type="number"
                min={0}
                max={6}
                value={formData.previousAbortions}
                onChange={e => handleChange("previousAbortions", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {submitError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep() || isSubmitting}
              className="px-4 py-2 rounded text-white bg-medisage-blue hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded text-white bg-medisage-green hover:bg-green-700"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;