import type { Brand } from '@sympauthy/design'
import type { InjectionKey } from 'vue'

export const SYMPAUTHY_NAME = 'SympAuthy'

export const brandKey = Symbol() as InjectionKey<Brand>

/**
 * Return the name to show for this deployment: the server leaves it out when none is configured.
 */
export function getBrandName(brand: Brand): string {
  return brand.displayName ?? SYMPAUTHY_NAME
}
