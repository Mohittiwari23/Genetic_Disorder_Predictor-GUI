import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Info, Pill, ShieldCheck, Clock } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Genetic Data Analysis",
      description: "Analyze your genetic information for clear, actionable insights.",
      icon: FileText,
      features: ["Genetic Risk Assessment", "Personalized Disorder Prediction", "Instant Data Processing", "Clear Health Recommendations"],
    },
    {
      title: "Symptom-Disorder Mapping",
      description: "Map symptoms to potential genetic disorders for faster diagnosis",
      icon: Info,
      features: ["Symptom correlation", "Disorder probability scoring", "Diagnostic suggestion", "Early detection alerts"],
    },
    {
      title: "Inheritance Pattern Insights",
      description: "Understand how genetic disorders are passed through families",
      icon: Pill,
      features: ["Family history analysis", "Inheritance probability", "Carrier screening", "Genetic linkage mapping"],
    },
    {
      title: "Health Risk Prediction",
      description: "Predict potential health risks based on genetic data",
      icon: ShieldCheck,
      features: ["Risk factor identification", "Early warning alerts", "Personalized health advice", "Preventive measures suggestions"],
    },
    {
      title: "24/7 Accessibility",
      description: "24/7 accessible and user-friendly platform",
      icon: Clock,
      features: ["Always available", "Mobile friendly", "Easy navigation", "Quick results"],
    },
  ]

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transforming healthcare through innovative digital solutions
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <service.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">{service.title}</CardTitle>
              </div>
              <CardDescription className="text-base">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-2">
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-base">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

