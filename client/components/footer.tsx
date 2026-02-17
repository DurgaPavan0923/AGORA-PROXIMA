"use client"

import { CheckCircle2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Agora</span>
            </div>
            <p className="text-sm text-muted-foreground">Transparent governance for modern communities</p>
          </div>

          {/* Links */}
          {[
            {
              title: "Product",
              links: ["Features", "Security", "Pricing"],
            },
            {
              title: "Resources",
              links: ["Documentation", "Blog", "Support"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookie Policy"],
            },
          ].map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2025 Agora. Built for transparent governance.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
