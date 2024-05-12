import { AbstractApi } from '@/client/api/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import { type TimeZoneResource, timeZoneResourceSchema } from '@/client/model/TimeZoneResource'

export class TimeZoneApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchTimeZones(claim: string): Promise<Array<TimeZoneResource>> {
    return this.get({
      authenticated: true,
      path: `/api/v1/flow/claims/${claim}/timezones`,
      schema: {
        type: 'array',
        items: {
          ...timeZoneResourceSchema
        }
      }
    })
  }
}

export const timeZoneApiKey: InjectionKey<TimeZoneApi> = Symbol('TimeZoneApi')
