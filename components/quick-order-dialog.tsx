"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export interface QuickOrderProduct {
  name: string
  price: number
  image: string
}

interface QuickOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: QuickOrderProduct | null
}

export function QuickOrderDialog({
  open,
  onOpenChange,
  product,
}: QuickOrderDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setName("")
    setPhone("")
    setComment("")
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const trimmedPhone = phone.replace(/\D/g, "")
    if (trimmedPhone.length < 10) {
      toast({
        title: "Укажите телефон",
        description: "Введите корректный номер телефона для связи.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Здесь можно отправить заявку на бэкенд
      await new Promise((r) => setTimeout(r, 600))
      toast({
        title: "Заявка принята",
        description: `Мы перезвоним вам в ближайшее время по поводу «${product.name}».`,
      })
      onOpenChange(false)
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Быстрый заказ
          </DialogTitle>
        </DialogHeader>

        {/* Превью товара */}
        <div className="flex gap-4 p-3 rounded-xl bg-muted/50">
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {product.price.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-order-name">Ваше имя</Label>
            <Input
              id="quick-order-name"
              placeholder="Как к вам обращаться"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-order-phone">Телефон</Label>
            <Input
              id="quick-order-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-order-comment">Комментарий (необязательно)</Label>
            <Input
              id="quick-order-comment"
              placeholder="Пожелания по заказу или доставке"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка…" : "Оставить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
