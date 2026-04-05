import type { ClaimType } from '@/client/model/config/ClaimType'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'

export interface ClaimConfiguration {
  id: string
  required: boolean
  name: string
  type: ClaimType
  group?: ClaimGroup
}
