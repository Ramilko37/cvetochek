"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-secondary p-8 md:p-12 lg:p-16 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          Будьте <em>в курсе</em>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Подпишитесь на рассылку и получайте эксклюзивные предложения, 
          новинки и советы по уходу за цветами.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full bg-background border-0 h-12 px-5"
            required
          />
          <Button
            type="submit"
            className="rounded-full h-12 px-8 bg-foreground text-background hover:bg-foreground/90"
          >
            Подписаться
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          Подписываясь, вы соглашаетесь получать маркетинговые письма. Отписаться можно в любой момент.
        </p>
      </div>
    </section>
  )
}
