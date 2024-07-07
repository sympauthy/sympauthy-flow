import type { I18n } from 'vue-i18n'
import { translateMessage } from '@/i18n'

export function isNotEmpty(value: string | undefined | null): value is string {
  return value !== undefined && value !== null && value.length > 0
}

export function isNotBlankNorEmpty(value: string | undefined | null): value is string {
  if (isNotEmpty(value)) {
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
    return values[0]
  }
  return values.slice(2).reduce(
    (acc, it) => {
      return translateMessage('or.separator', { '0': acc, '1': it })
    },
    translateMessage('or.or', { '0': values[0], '1': values[1] })
  )
}
