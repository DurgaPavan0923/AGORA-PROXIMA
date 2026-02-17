"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Search, TrendingUp, Calendar } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  description: string
  locality: string
  category: "proposal" | "update" | "vote" | "civic"
  date: string
  impact: string
  image: string
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "New Public Park Proposal Passes in South Delhi",
    description:
      "Residents of Greater Kailash voted to allocate ₹5 crore for developing a 2-acre public green space with playgrounds and fitness equipment.",
    locality: "Greater Kailash, Delhi",
    category: "proposal",
    date: "2 hours ago",
    impact: "Construction to begin next month",
    image: "/public-park-construction.jpg",
  },
  {
    id: "2",
    title: "Road Repair Initiative: East Bangalore Gets Better Infrastructure",
    description:
      "Through community voting, residents prioritized street repairs affecting 50,000+ residents. ₹2.3 crore allocated.",
    locality: "Indiranagar, Bangalore",
    category: "civic",
    date: "5 hours ago",
    impact: "Work begins January 15",
    image: "/road-repair-infrastructure.jpg",
  },
  {
    id: "3",
    title: "Water Supply Improvement Voted by Pune West Community",
    description:
      "Citizens voted YES (87% approval) on implementing new water treatment system. Quality improvements expected in 6 months.",
    locality: "Baner, Pune",
    category: "update",
    date: "8 hours ago",
    impact: "Clean water for 300,000 residents",
    image: "/water-supply-treatment-plant.jpg",
  },
  {
    id: "4",
    title: "School Safety Project Wins Community Support in Mumbai",
    description:
      "Residents voted to enhance security systems in 25 municipal schools. CCTV and better lighting installation underway.",
    locality: "Bandra, Mumbai",
    category: "vote",
    date: "12 hours ago",
    impact: "Safety enhanced for 15,000 students",
    image: "/school-security-camera-system.png",
  },
  {
    id: "5",
    title: "Kolkata's Slum Rehabilitation Project Approved",
    description:
      "Collective voting approved housing for 1,000 families. Eco-friendly construction standards to be followed.",
    locality: "South Kolkata",
    category: "proposal",
    date: "1 day ago",
    impact: "Homes for 5,000 people",
    image: "/housing-construction-urban-development.jpg",
  },
  {
    id: "6",
    title: "Hyderabad: Traffic Signal Optimization Improves Commute",
    description:
      "Data-driven voting led to smart traffic signal installation across 5 major intersections. 30% reduction in peak-hour congestion.",
    locality: "Madhapur, Hyderabad",
    category: "civic",
    date: "1 day ago",
    impact: "30 min less commute time",
    image: "/smart-traffic-signals.jpg",
  },
]

const categories = [
  { value: "all", label: "All News" },
  { value: "proposal", label: "Proposals" },
  { value: "update", label: "Updates" },
  { value: "vote", label: "Voting Results" },
  { value: "civic", label: "Civic Projects" },
]

export default function NewsPortal() {
  const [news, setNews] = useState<NewsItem[]>(mockNews)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocality, setUserLocality] = useState("All India")

  useEffect(() => {
    let filtered = mockNews

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.locality.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setNews(filtered)
  }, [selectedCategory, searchTerm])

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section id="news" className="flex-1 py-12 sm:py-16 bg-gradient-to-b from-background to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center slide-up">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Local News & Civic Updates
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Stay informed about proposals, votes, and community decisions in your area
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-6 mb-8 slide-up">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search news, localities..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{userLocality}</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? "bg-primary text-primary-foreground" : ""}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group slide-up"
                style={{ animationDelay: `${(i % 6) * 0.1}s` }}
              >
                <div className="h-40 bg-gradient-to-br from-orange-100 to-green-100 overflow-hidden relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-primary">
                      {categories.find((c) => c.value === item.category)?.label}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{item.locality}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-4 h-4 text-secondary" />
                      <span className="text-muted-foreground">{item.impact}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                    variant="default"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No news found matching your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all")
                  setSearchTerm("")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
