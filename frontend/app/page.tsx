"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { MediSageAnimation } from "@/components/medisage-animation"
import UploadModal from "@/components/upload-modal"
import { predictGeneticDisorder, FormData, PredictionResponse } from "@/apiService"
import ResultsPage from "@/components/ResultsPage"

export default function Home() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [results, setResults] = useState<(PredictionResponse & { name?: string; age?: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)

      const result = await predictGeneticDisorder(formData)
      // Include name and age from formData in the results
      setResults({
        ...result,
        name: formData.name,
        age: formData.age
      })
      setUploadOpen(false)
    } catch (err: any) {
      console.error("Prediction failed:", err)
      setError("Prediction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetResults = () => {
    setResults(null)
  }

  return (
    <div className="max-w-[1440px] mx-auto px-20">
      <div className="flex items-center justify-between min-h-[calc(100vh-180px)] gap-20">
        <div className="flex-1 space-y-10">
          <h1 className="text-6xl font-bold leading-tight tracking-tighter">
            <span className="text-medisage-blue">Decode.</span>
            <br />
            Understand.
            <br />
            <span className="text-medisage-green">Heal.</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            GenPlus helps you predict genetic disorders with precision. 
            Fill out the form with your medical and genetic details, and let our AI guide you to early diagnosis and personalized healthcare insights.
          </p>
          <Button
            className="gap-3 text-lg px-8 py-7 transition-all duration-200 hover:scale-105 bg-medisage-blue hover:bg-medisage-blue/90"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="w-5 h-5" />
            Fill Form
          </Button>

          {error && <div className="text-red-500">{error}</div>}
          {loading && <div className="text-blue-500">Processing...</div>}
        </div>

        <div className="flex-1 flex justify-center items-center">
          <MediSageAnimation />
        </div>
      </div>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} onSubmit={handleFormSubmit} />

      {results && (
        <div className="mt-20">
          <ResultsPage results={results} onReset={resetResults} />
        </div>
      )}
    </div>
  )
}