import type { Metadata } from "next"
import { ValentineProductPageClient } from "@/components/valentine-product-page-client"

interface ValentinesProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ValentinesProductPageProps): Promise<Metadata> {
  return {
    title: "День всех влюблённых | Цветочек в Горшочек",
    description: "Букеты к 14 февраля с доставкой по Москве",
  }
}

export default async function ValentinesProductPage({ params }: ValentinesProductPageProps) {
  const { id } = await params
  return <ValentineProductPageClient id={id} />
}
