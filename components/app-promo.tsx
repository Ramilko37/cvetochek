"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AppPromo() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-accent/30">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="p-8 md:p-12 lg:p-16 order-2 md:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-xl">
                🌷
              </div>
              <span className="font-serif text-xl text-foreground">Цветочек в Горшочек</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Все возможности<br />в приложении
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-md">
              Теперь заказать букет ещё проще. Включайте уведомления 
              и получайте персональные предложения первыми.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl px-6 py-5 border-foreground/20 hover:bg-foreground hover:text-background bg-transparent"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl px-6 py-5 border-foreground/20 hover:bg-foreground hover:text-background bg-transparent"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative h-80 md:h-[500px] order-1 md:order-2 flex items-center justify-center">
            <div className="relative w-48 md:w-64 h-full">
              <div className="absolute inset-4 bg-foreground rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-xl" />
                <Image
                  src="/images/hero-peonies.jpg"
                  alt="App screenshot"
                  fill
                  className="object-cover rounded-[2rem] p-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
