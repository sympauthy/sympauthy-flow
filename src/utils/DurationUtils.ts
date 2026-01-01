import { Temporal } from '@js-temporal/polyfill'
import Duration = Temporal.Duration

/**
 * Convert a duration to a human-readable string.
 * @param duration
 * @example
 * formatToHumanReadable(Duration.from({ hours: 30, minutes: 10, seconds: 20 })) // "30h 10mn 20s"
 * formatToHumanReadable(Duration.from({ minutes: 2, seconds: 1 })) // "2mn 1s"
 * formatToHumanReadable(Duration.from({ seconds: 10 })) // "10s"
 */
export const formatToHumanReadable = (duration: Duration) => {
  const parts: string[] = []

  const hours = Math.floor(Math.abs(duration.total('hours')))
  const minutes = Math.floor(Math.abs(duration.total('minutes'))) % 60
  const seconds = Math.floor(Math.abs(duration.total('seconds'))) % 60

  if (hours > 0) {
    parts.push(`${hours}h`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}mn`)
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`)
  }

  return parts.join(' ')
}
