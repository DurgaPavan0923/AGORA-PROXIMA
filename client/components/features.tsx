"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Shield, MapPin, Volume2, Eye } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Fair & Equal Participation",
    description:
      "One digital identity per person prevents duplicate voting and fake accounts, ensuring every citizen has an equal voice.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Stronger Security",
    description:
      "Blockchain technology ensures once information is recorded, nobody can secretly change or erase it—not even officials.",
    color: "text-accent",
  },
  {
    icon: Eye,
    title: "Complete Transparency",
    description:
      "All proposals, votes, and feedback are visible to the community, making it nearly impossible to hide changes or cheat.",
    color: "text-secondary",
  },
  {
    icon: Zap,
    title: "Privacy Protected",
    description:
      "Your participation is recorded, but your personal details stay private. Only proof of participation is shown.",
    color: "text-primary",
  },
  {
    icon: MapPin,
    title: "Locality Updates",
    description:
      "Receive AI-curated news about your local area and stay informed about proposals affecting your community.",
    color: "text-accent",
  },
  {
    icon: Volume2,
    title: "Voice Assistant",
    description:
      "Accessible voting with voice guidance for blind and low-vision users, ensuring inclusive participation.",
    color: "text-secondary",
  },
]

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Why Choose Agora?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Built on trust, transparency, and inclusion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border border-border hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
