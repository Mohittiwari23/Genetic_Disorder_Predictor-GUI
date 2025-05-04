// app/prediction/page.tsx
"use client";

import React, { useState } from "react";
import UploadModal from "@/components/upload-modal";
import ResultsPage from "@/components/ResultsPage";
import { predictGeneticDisorder, FormData, PredictionResponse } from "@/apiService";

export default function PredictionPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [results, setResults] = useState<(PredictionResponse & { name?: string; age?: string }) | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: FormData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const predictionResults = await predictGeneticDisorder(formData);
      setResults({
        ...predictionResults,
        name: formData.name,
        age: formData.age
      });
      setModalOpen(false);
    } catch (err) {
      setError("Failed to get prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetResults = (): void => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {!results ? (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Genetic Disorder Prediction</h1>
            <p className="mb-8 text-gray-600">
              Enter patient information to predict potential genetic disorders.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Start Prediction
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {loading && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                Processing prediction...
              </div>
            )}
            
            <UploadModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onSubmit={handleFormSubmit}
            />
          </div>
        ) : (
          <ResultsPage results={results} onReset={resetResults} />
        )}
      </div>
    </div>
  );
}