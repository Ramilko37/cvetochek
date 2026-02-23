"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl md:text-2xl text-center">
            Вход в аккаунт
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground text-center">
          Введите номер телефона — мы отправим код для входа
        </p>
        <LoginForm embedded onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
