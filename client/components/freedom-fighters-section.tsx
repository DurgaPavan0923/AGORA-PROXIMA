"use client"

import { Card, CardContent } from "@/components/ui/card"

const freedomFighters = [
  {
    name: "Jawaharlal Nehru",
    quote: "In a democracy, the individual voter is sovereign.",
    impact: "First PM of India",
  },
  {
    name: "Dr. B.R. Ambedkar",
    quote: "Constitutional morality is not a natural sentiment. It has to be cultivated.",
    impact: "Architect of Indian Constitution",
  },
  {
    name: "Sardar Vallabhbhai Patel",
    quote: "Our success depends on our unity.",
    impact: "Iron Man of India",
  },
  {
    name: "Mahatma Gandhi",
    quote: "In democracy, power flows from people.",
    impact: "Father of the Nation",
  },
]

export function FreedomFightersSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Legacy of Democracy</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Inspired by India's freedom fighters who believed in the power of collective voice
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {freedomFighters.map((fighter, i) => (
            <Card
              key={i}
              className="border-2 border-orange-200 hover:border-primary transition-all duration-300 hover:shadow-lg group bg-gradient-to-br from-orange-50 to-background slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <p className="font-bold text-foreground text-lg">{fighter.name}</p>
                  <p className="italic text-sm text-muted-foreground">"{fighter.quote}"</p>
                  <p className="text-xs font-semibold text-primary bg-orange-100 px-3 py-1 rounded-full inline-block">
                    {fighter.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
