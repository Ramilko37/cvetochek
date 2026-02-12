"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

function formatPhoneMask(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("8")) digits = "7" + digits.slice(1)
  else if (digits.length > 0 && digits[0] !== "7") digits = "7" + digits
  digits = digits.slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length === 1) return "+7"
  const rest = digits.slice(1)
  let out = "+7 (" + rest.slice(0, 3)
  if (rest.length > 3) out += ") " + rest.slice(3, 6)
  if (rest.length > 6) out += "-" + rest.slice(6, 8)
  if (rest.length > 8) out += "-" + rest.slice(8, 10)
  return out
}

export function CustomOrderForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [budget, setBudget] = useState("")
  const [wishes, setWishes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [websiteHp, setWebsiteHp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneMask(e.target.value))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f && f.type.startsWith("image/")) setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type.startsWith("image/")) setFile(f)
    if (fileInputRef.current) {
      const dt = new DataTransfer()
      if (f) dt.items.add(f)
      fileInputRef.current.files = dt.files
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      toast({
        title: "Укажите имя",
        description: "Введите имя не короче двух символов.",
        variant: "destructive",
      })
      return
    }
    if (!/^[\p{L}\s\-]+$/u.test(trimmedName)) {
      toast({
        title: "Некорректное имя",
        description: "Имя может содержать только буквы, пробелы и дефис.",
        variant: "destructive",
      })
      return
    }

    const trimmedPhone = phone.replace(/\D/g, "")
    if (trimmedPhone.length < 10) {
      toast({
        title: "Укажите телефон",
        description: "Введите корректный номер телефона.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", trimmedName)
      formData.append("phone", phone.trim())
      formData.append("budget", budget.trim())
      formData.append("wishes", wishes.trim())
      if (websiteHp) formData.append("websiteHp", websiteHp)
      if (file && file.size > 0) formData.append("file", file)

      const res = await fetch("/api/custom-order", {
        method: "POST",
        body: formData,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось отправить заявку. Попробуйте позже.",
          variant: "destructive",
        })
        return
      }

      setSent(true)
      setName("")
      setPhone("")
      setBudget("")
      setWishes("")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      toast({
        title: "Заявка отправлена",
        description: "Наш флорист свяжется с вами в ближайшее время.",
      })
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

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-secondary/50 p-8 text-center">
        <p className="text-lg font-medium text-foreground">
          Спасибо! Ваша заявка отправлена.
        </p>
        <p className="mt-2 text-muted-foreground">
          Наш флорист свяжется с вами в ближайшее время для уточнения деталей.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="custom-order-name">Имя</Label>
          <Input
            id="custom-order-name"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-lg"
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-order-phone">Телефон для связи</Label>
          <Input
            id="custom-order-phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={phone}
            onChange={handlePhoneChange}
            className="h-11 rounded-lg"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-order-budget">Бюджет (от и до)</Label>
        <Input
          id="custom-order-budget"
          placeholder="Например: 3 000 — 5 000 ₽"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="h-11 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-order-wishes">Ваши пожелания (цветовая гамма, любимые цветы или настроение)</Label>
        <Textarea
          id="custom-order-wishes"
          placeholder="Опишите, что бы вы хотели видеть в букете"
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          className="rounded-lg min-h-[100px] resize-y"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Прикрепите фото-референс (пример желаемого букета)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          id="custom-order-file"
        />
        {file ? (
          <div className="flex items-center h-45 gap-3 p-3 rounded-xl border border-border bg-secondary/30">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-sm text-foreground truncate flex-1 min-w-0">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Удалить файл"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="custom-order-file"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "flex flex-col items-center justify-center w-full h-45 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/30"
            )}
          >
            <Upload className="h-10 w-8 text-muted-foreground/60 mb-2" />
            <span className="text-sm text-muted-foreground text-center px-4">
              Нажмите или перетащите фото сюда
            </span>
          </label>
        )}
        <p className="text-xs text-muted-foreground">
          Загрузите фото, если хотите показать флористу пример желаемого букета
        </p>
      </div>

      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="custom-order-hp">Не заполняйте</label>
        <input
          id="custom-order-hp"
          tabIndex={-1}
          autoComplete="off"
          value={websiteHp}
          onChange={(e) => setWebsiteHp(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full px-8 py-6 text-base w-full"
      >
        {isSubmitting ? "Отправка…" : "Отправить заявку флористу"}
      </Button>
    </form>
  )
}
