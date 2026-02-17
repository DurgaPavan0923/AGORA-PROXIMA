"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Shield, Zap } from "lucide-react"

const impacts = [
  {
    icon: TrendingUp,
    title: "Every Vote Counts",
    description: "Your single vote can change the outcome of local decisions affecting your community",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Collective Power",
    description: "When citizens participate, government decisions align with genuine community needs",
    color: "text-secondary",
  },
  {
    icon: Shield,
    title: "Protected Rights",
    description: "Blockchain ensures your vote is secure and cannot be tampered with",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Real Impact",
    description: "Watch your proposals become reality through transparent, community-driven governance",
    color: "text-primary",
  },
]

export function VotingPowerSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">The Power of Your Vote</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Understand how your participation transforms local governance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact, i) => (
            <Card
              key={i}
              className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors`}
                >
                  <impact.icon className={`w-6 h-6 ${impact.color}`} />
                </div>
                <CardTitle className="text-lg">{impact.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{impact.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 bg-gradient-to-r from-orange-50 to-green-50 p-8 rounded-2xl border-2 border-orange-200">
          <div className="text-center slide-up stagger-1">
            <p className="text-4xl font-bold text-primary mb-2">1.4B+</p>
            <p className="text-muted-foreground">Indian Citizens</p>
          </div>
          <div className="text-center slide-up stagger-2">
            <p className="text-4xl font-bold text-primary mb-2">1:1</p>
            <p className="text-muted-foreground">One Vote = One Voice</p>
          </div>
          <div className="text-center slide-up stagger-3">
            <p className="text-4xl font-bold text-primary mb-2">∞</p>
            <p className="text-muted-foreground">Unlimited Potential</p>
          </div>
        </div>
      </div>
    </section>
  )
}
