import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import { Schema, string } from 'yup'
import type { CollectedClaimConfigurationResource } from '@/client/model/config/CollectedClaimConfigurationResource'
import type { ClaimConfigurationResource } from '@/client/model/config/ClaimConfigurationResource'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'
import type { InjectionKey } from 'vue'
import { ConfigurationApi } from '@/client/api/ConfigurationApi'

export class ClaimInputFieldOptions {
  constructor(
    readonly claim: ClaimConfigurationResource,
    readonly config: CollectedClaimConfigurationResource
  ) {
  }
}

export class ClaimInputGroupOptions {
  constructor(
    readonly group: ClaimGroup,
    readonly options: Array<ClaimInputFieldOptions>
  ) {
  }
}

export class ClaimFormService {

  /**
   * Return a list of pair associating the claim to their respective configuration.
   * If a claim is not found for a configuration, we ignore it.
   */
  getClaimAndConfigPairs(
    configuration: ConfigurationResource,
    configs: Array<CollectedClaimConfigurationResource>
  ): Array<[ClaimConfigurationResource, CollectedClaimConfigurationResource]> {
    const claims: Array<[ClaimConfigurationResource, CollectedClaimConfigurationResource]> = []
    for (const config of configs) {
      const claim = configuration.claims.find(it => it.id === config.id)
      if (claim !== undefined) {
        claims.push([claim, config])
      }
    }
    return claims
  }

  /**
   * Return a list of Yup schema validating the provided end-user claims.
   */
  getSchemasForClaims(
    configuration: ConfigurationResource,
    configs: Array<CollectedClaimConfigurationResource>
  ): Record<string, Schema> {
    const schema: Record<string, Schema> = {}
    for (const [claim, config] of this.getClaimAndConfigPairs(configuration, configs)) {
      schema[claim.id] = this.getSchemaForClaim(claim, config)
    }
    return schema
  }

  /**
   * Return a Yup schema validating the provided end-user claim.
   *
   * @param claim The end-user claim to validate.
   * @param config Additional config depending on the context where the claim is collected (sign-in, sign-up, etc.).
   */
  getSchemaForClaim(
    claim: ClaimConfigurationResource,
    config: CollectedClaimConfigurationResource
  ): Schema {
    let claimSchema: Schema
    switch (claim.type) {
      case 'string':
        claimSchema = string()
        break
      case 'email':
        claimSchema = string().email()
        break
    }
    if (config.required) {
      claimSchema = claimSchema.required()
    }
    return claimSchema
  }

  /**
   * Return the list of input field and input group to display to the end-user.
   *
   * The list is sorted in the order they must be presented to the end-user.
   */
  getOptionsForClaims(
    configuration: ConfigurationResource,
    configs: Array<CollectedClaimConfigurationResource>
  ): Array<ClaimInputFieldOptions | ClaimInputGroupOptions> {
    const optionsArray: Array<ClaimInputFieldOptions | ClaimInputGroupOptions> = []
    const sortedClaims: Array<string> = []
    const claimAndConfigPairs = this.getClaimAndConfigPairs(configuration, configs)
    for (const [claim, config] of claimAndConfigPairs) {
      if (!sortedClaims.includes(claim.id)) {
        if (claim.group !== undefined) {
          const options = this.createInputOptionsForGroup(claim.group, claimAndConfigPairs)
          optionsArray.push(options)
          sortedClaims.push(...options.options.map(it => it.claim.id))
        } else {
          const options = this.createInputOptionsForClaim(claim, config)
          optionsArray.push(options)
          sortedClaims.push(claim.id)
        }
      }
    }
    return optionsArray
  }

  private createInputOptionsForGroup(
    group: ClaimGroup,
    claimAndConfigPairs: Array<[ClaimConfigurationResource, CollectedClaimConfigurationResource]>
  ): ClaimInputGroupOptions {
    const claimsOptions = claimAndConfigPairs
      .filter(it => it[0].group === group)
      .map(([claim, config]) => this.createInputOptionsForClaim(claim, config))
    return new ClaimInputGroupOptions(group, claimsOptions)
  }

  private createInputOptionsForClaim(
    claim: ClaimConfigurationResource,
    config: CollectedClaimConfigurationResource
  ): ClaimInputFieldOptions {
    return new ClaimInputFieldOptions(claim, config)
  }
}

export const claimFormServiceKey: InjectionKey<ClaimFormService> = Symbol('ClaimFormService')
