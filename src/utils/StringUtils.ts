export function isBlankOrEmpty(value: string | undefined | null): boolean {
  if (!value) {
    return true
  }
  const trimmedValue = value.trim()
  return trimmedValue.length == 0
}
