import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import { type TimeZoneResource, timeZoneResourceSchema } from '@/client/model/TimeZoneResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class TimeZoneApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchTimeZones(claim: string): Promise<SuccessApiResponse<Array<TimeZoneResource>> | ErrorApiResponse> {
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
