import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import type { InjectionKey } from 'vue'

export class ClaimService {

  /**
   * Return the claims that must be collected when a new user sign-up as they will be used
   * as login.
   */
  getSignUpClaims(configuration: ConfigurationResource): Array<string> {
    return configuration.password?.sign_up_claims || []
  }

  /**
   * Return the claims that are collectable from the end-user.
   */
  getCollectableClaims(configuration: ConfigurationResource): Array<string> {
    const signUpClaims = this.getSignUpClaims(configuration)
    return configuration.claims
      .filter(it => !signUpClaims.includes(it.id))
      .map(it => it.id)
  }
}

export const claimServiceKey: InjectionKey<ClaimService> = Symbol('ClaimService')
