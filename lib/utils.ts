import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const basePath = process.env.NODE_ENV === 'production' ? '/cvetochek' : ''

export function getImagePath(path: string): string {
  return `${basePath}${path}`
}
