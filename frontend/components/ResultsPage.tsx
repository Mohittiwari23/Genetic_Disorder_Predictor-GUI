// components/ResultsPage.tsx
import React from "react";
import { PredictionResponse } from "../apiService";
import Link from "next/link";

const slugify = (label: string) => {
  if (label.includes("Mitochondrial")) return "mitochondrial";
  if (label.includes("Multifactorial")) return "multifactorial";
  if (label.includes("Single-gene")) return "single-gene";
  return "unknown";
};

interface ResultsPageProps {
  results: PredictionResponse & { name?: string; age?: string };
  onReset: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ results, onReset }) => {
  const getHighestProbClass = (): number => {
    const probs = [results.class_0, results.class_1, results.class_2];
    const maxProb = Math.max(...probs);
    return probs.indexOf(maxProb);
  };

  const confidencePercent = (): string => {
    const highestIndex = getHighestProbClass();
    const value = [results.class_0, results.class_1, results.class_2][highestIndex];
    return (value * 100).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Genetic Disorder Prediction Results
      </h2>

      {(results.name || results.age) && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Prediction for: <span className="font-medium">{results.name || "Unnamed"}</span>
          {results.age && ` (${results.age} years old)`}
        </p>
      )}

      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-2">Predicted Disorder:</h3>
        <p className="text-lg font-bold text-blue-800">{results.prediction}</p>
        <p className="text-sm text-gray-600 mt-2">
          Confidence: {confidencePercent()}%
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Probability Distribution:</h3>
        <div className="space-y-4">
          <ProbabilityBar
            label="Mitochondrial Genetic"
            value={results.class_0}
            isHighest={getHighestProbClass() === 0}
          />
          <ProbabilityBar
            label="Multifactorial Genetic"
            value={results.class_1}
            isHighest={getHighestProbClass() === 1}
          />
          <ProbabilityBar
            label="Single-gene Inheritance"
            value={results.class_2}
            isHighest={getHighestProbClass() === 2}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
        >
          Start New Prediction
        </button>
        <Link href={`/disorder/all?highlight=${slugify(results.prediction)}`}>
          <button className="px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 font-medium">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
};

interface ProbabilityBarProps {
  label: string;
  value: number;
  isHighest: boolean;
}

const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  label,
  value,
  isHighest,
}) => {
  const percentage = (value * 100).toFixed(2);
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className={`text-sm font-medium ${isHighest ? "font-bold" : ""}`}>
          {label}
        </span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            isHighest ? "bg-blue-600" : "bg-gray-400"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ResultsPage;
