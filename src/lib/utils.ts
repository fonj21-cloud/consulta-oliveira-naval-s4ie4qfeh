import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single string
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a string to the standard CNJ format for legal processes
 * Example: 0000000-00.0000.0.00.0000
 */
export const formatCNJ = (value: string) => {
  let v = value.replace(/\D/g, '')
  if (v.length > 20) v = v.substring(0, 20)
  if (v.length > 15) {
    v = v.replace(/^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/, '$1-$2.$3.$4.$5.$6')
  } else {
    v = v.replace(/^(\d{7})(\d)/, '$1-$2')
    v = v.replace(/-(\d{2})(\d)/, '-$1.$2')
    v = v.replace(/\.(\d{4})(\d)/, '.$1.$2')
    v = v.replace(/\.(\d)(\d)/, '.$1.$2')
    v = v.replace(/\.(\d{2})(\d)/, '.$1.$2')
  }
  return v
}
