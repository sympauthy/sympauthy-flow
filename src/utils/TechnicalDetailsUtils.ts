/**
 * A line of an error's technical details, which a person hands to support.
 */
export type TechnicalDetail = {
  label: string
  value: string
}

/**
 * Format the time as `2026-11-13 09:56:12 UTC`: support reads it against its logs, kept in UTC,
 * whatever time zone the person is in.
 */
export function formatUtcTime(date: Date): string {
  return `${date.toISOString().slice(0, 19).replace('T', ' ')} UTC`
}

/**
 * Format the details as they are copied, one line each, as `Label: value`.
 */
export function formatTechnicalDetails(details: Array<TechnicalDetail>): string {
  return details.map(({ label, value }) => `${label}: ${value}`).join('\n')
}
