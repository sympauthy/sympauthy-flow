import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import type { InjectionKey } from 'vue'

export class ClaimService {

  /**
   * Return the claims that uniquely identify a user.
   * Used as login claims for password sign-in and as required claims during sign-up.
   */
  getIdentifierClaims(configuration: ConfigurationResource): Array<string> {
    return configuration.password?.identifier_claims || []
  }

}

export const claimServiceKey: InjectionKey<ClaimService> = Symbol('ClaimService')
