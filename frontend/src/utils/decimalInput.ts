/**
 * Normalize comma to dot and parse to float.
 * Returns 0 for empty or invalid input.
 */
export function parseDecimalInput(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const normalized = String(value).replace(',', '.')
  const num = parseFloat(normalized)
  return isNaN(num) ? 0 : num
}

/**
 * Parse to integer (floor), handling comma decimal separators.
 * Returns 0 for empty or invalid input.
 */
export function parseIntInput(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const normalized = String(value).replace(',', '.')
  const num = Math.floor(parseFloat(normalized))
  return isNaN(num) ? 0 : num
}

/**
 * Format a number for display in a decimal text field.
 * Returns empty string for null/undefined so the field appears empty.
 */
export function formatDecimalDisplay(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

/**
 * Normalize comma to dot in a raw input string.
 * Use as the @update:model-value handler for decimal text fields to allow
 * both "." and "," as decimal separators while preserving partial input like "90.".
 */
export function normalizeDecimalStr(value: string): string {
  return value.replace(',', '.')
}
