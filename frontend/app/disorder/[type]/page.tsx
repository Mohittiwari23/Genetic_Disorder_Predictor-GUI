import { notFound } from "next/navigation"
import Image from "next/image"

const disorderInfo: Record<
  string,
  {
    title: string
    intro: string
    features: string[]
    examples: string[]
    imageUrl: string
    imageAlt: string
    caption: string
  }
> = {
  "single-gene": {
    title: "Single-gene Inheritance Diseases",
    intro:
      "These disorders are caused by mutations in a single gene. They can follow patterns such as autosomal dominant, autosomal recessive, or X-linked inheritance.",
    features: [
      "Caused by mutation in one specific gene",
      "Inheritance patterns can be dominant or recessive",
      "Often predictable and traceable through family trees"
    ],
    examples: ["Cystic fibrosis", "Sickle cell anemia", "Huntington's disease"],
    imageUrl:
      "https://www.hudsonalpha.org/wp-content/uploads/2022/04/EDNA_Autosomal_Dominant_vs_Recessive_Inheritance.png",
    imageAlt: "Autosomal Dominant vs Recessive Inheritance Diagram",
    caption: "Visual: Dominant vs Recessive Inheritance"
  },
  multifactorial: {
    title: "Multifactorial Genetic Disorders",
    intro:
      "These disorders result from a combination of multiple genes and environmental factors such as diet, lifestyle, and exposure to toxins.",
    features: [
      "Involve many genes (polygenic inheritance)",
      "Strong environmental influence",
      "Often run in families but don't follow clear patterns"
    ],
    examples: ["Heart disease", "Diabetes", "Certain types of cancer"],
    imageUrl:
      "https://learn-genetics.b-cdn.net/disorders/multifactorial/hypothyroidism/images/autosomal-recessive.jpg",
    imageAlt: "Multifactorial Inheritance Chart",
    caption: "Visual: Genetic and environmental interaction"
  },
  mitochondrial: {
    title: "Mitochondrial Genetic Inheritance",
    intro:
      "These disorders are caused by mutations in the mitochondrial DNA (mtDNA), which is inherited exclusively from the mother.",
    features: [
      "Affects mitochondria, the cell's energy producers",
      "Passed down only from mothers to children",
      "Can affect multiple systems due to energy dependency"
    ],
    examples: ["Leigh syndrome", "Mitochondrial myopathy", "MELAS syndrome"],
    imageUrl:
      "https://www.genetics.edu.au/FSImages/FS-12-2.png",
    imageAlt: "Mitochondrial Inheritance Diagram",
    caption: "Visual: Mitochondrial inheritance showing maternal transmission"
  }
}

export default function DisorderDetailsPage({ params }: { params: { type: string } }) {
  const disorder = disorderInfo[params.type]

  if (!disorder) return notFound()

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-6">{disorder.title}</h1>

      <div className="mb-6 flex justify-center">
        <Image
          src={disorder.imageUrl}
          alt={disorder.imageAlt}
          width={800}
          height={600}
          className="rounded-lg shadow-md"
        />
      </div>

      <p className="text-sm text-gray-500 text-center mb-8">{disorder.caption}</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">{disorder.intro}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
        {disorder.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Examples</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
        {disorder.examples.map((example, index) => (
          <li key={index}>{example}</li>
        ))}
      </ul>
    </div>
  )
}
