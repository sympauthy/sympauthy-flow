import type { I18n } from 'vue-i18n'
import { translateListMessage } from '@/i18n'

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isStringNotEmpty(value: string | undefined | null): value is string {
  return value !== undefined && value !== null && value.length > 0
}

export function isStringNotBlankNorEmpty(value: string | undefined | null): value is string {
  if (isStringNotEmpty(value)) {
    const trimmedValue = value.trim()
    return trimmedValue.length > 0
  } else {
    return false
  }
}

export function or(i18n: I18n, values: Array<string>): string {
  if (values.length === 0) {
    return ''
  }
  if (values.length === 1) {
    return values[0] || ''
  }
  // The messages read their values as a list, `{0}` and `{1}`, so they are given one.
  return values
    .slice(2)
    .reduce(
      (acc, it) => translateListMessage('or.separator', [acc, it]),
      translateListMessage('or.or', [values[0], values[1]])
    )
}
