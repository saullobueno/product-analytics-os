import { format, parseISO } from 'date-fns'

export function formatSignedPercent(value: number, digits = 0): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatReleaseDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d')
}
