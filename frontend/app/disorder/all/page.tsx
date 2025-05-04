"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

const disorderLabels = [
  {
    type: "mitochondrial",
    title: "Mitochondrial Genetic Inheritance",
    description: "Learn about disorders inherited through mitochondrial DNA.",
  },
  {
    type: "multifactorial",
    title: "Multifactorial Genetic Disorders",
    description: "Explore disorders caused by a mix of genes and environment.",
  },
  {
    type: "single-gene",
    title: "Single-Gene Inheritance Diseases",
    description: "Dive into diseases caused by single-gene mutations.",
  },
]

export default function AllDisordersPage() {
  const params = useSearchParams()
  const highest = params.get("highlight") // e.g., "mitochondrial"

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-10">Explore Genetic Disorders</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {disorderLabels.map(({ type, title, description }) => (
          <Link key={type} href={`/disorder/${type}`}>
            <div className={`border p-6 rounded-lg shadow hover:shadow-md transition duration-200 cursor-pointer
              ${highest === type ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}>
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
              {highest === type && (
                <p className="mt-2 text-xs font-medium text-blue-700">Highest Confidence Prediction</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
