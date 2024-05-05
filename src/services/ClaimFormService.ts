import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import { Schema, string } from 'yup'
import type { ClaimConfigurationResource } from '@/client/model/config/ClaimConfigurationResource'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'
import type { InjectionKey } from 'vue'

export interface ClaimInputOptions {
  getId(): string
}

export class ClaimInputFieldOptions implements ClaimInputOptions {
  constructor(
    readonly claim: ClaimConfigurationResource
  ) {
  }

  getId(): string {
    return this.claim.id
  }
}

export class ClaimInputGroupOptions implements ClaimInputOptions {
  constructor(
    readonly group: ClaimGroup,
    readonly options: Array<ClaimInputFieldOptions>
  ) {
  }

  getId(): string {
    return this.group
  }

  getClaimOptions(claim: string): ClaimInputFieldOptions | undefined {
    return this.options.find((it) => it.claim.id === claim)
  }
}

export class ClaimFormService {
  /**
   * Return a list of configuration for the provided claims.
   * If a claim is not found for a configuration, we ignore it.
   */
  getConfigForClaims(
    configuration: ConfigurationResource,
    claims: Array<string>
  ): Array<ClaimConfigurationResource> {
    const configs: Array<ClaimConfigurationResource> = []
    for (const claim of claims) {
      const claimConfig = configuration.claims.find((it) => it.id === claim)
      if (claimConfig !== undefined) {
        configs.push(claimConfig)
      }
    }
    return configs
  }

  /**
   * Return a list of Yup schema validating the provided end-user claims.
   */
  getSchemasForClaims(
    configuration: ConfigurationResource,
    claims: Array<string>
  ): Record<string, Schema> {
    const schema: Record<string, Schema> = {}
    for (const claim of this.getConfigForClaims(configuration, claims)) {
      schema[claim.id] = this.getSchemaForClaim(claim)
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
    claim: ClaimConfigurationResource
  ): Schema {
    let claimSchema: Schema
    switch (claim.type) {
      case 'string':
        claimSchema = string()
        break
      case 'email':
        claimSchema = string()//.email()
        break
    }
    if (claim.required) {
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
    claims: Array<string>
  ): Array<ClaimInputFieldOptions | ClaimInputGroupOptions> {
    const optionsArray: Array<ClaimInputFieldOptions | ClaimInputGroupOptions> = []

    const claimConfigs = this.getConfigForClaims(configuration, claims)
    const sortedClaims: Array<string> = []
    for (const claim of claimConfigs) {
      if (!sortedClaims.includes(claim.id)) {
        if (claim.group !== undefined) {
          const options = this.createInputOptionsForGroup(claim.group, claimConfigs)
          optionsArray.push(options)
          sortedClaims.push(...options.options.map((it) => it.claim.id))
        } else {
          const options = this.createInputOptionsForClaim(claim)
          optionsArray.push(options)
          sortedClaims.push(claim.id)
        }
      }
    }
    return optionsArray
  }

  private createInputOptionsForGroup(
    group: ClaimGroup,
    claimAndConfigPairs: Array<ClaimConfigurationResource>
  ): ClaimInputGroupOptions {
    const claimsOptions = claimAndConfigPairs
      .filter((it) => it.group === group)
      .map((claim) => this.createInputOptionsForClaim(claim))
    return new ClaimInputGroupOptions(group, claimsOptions)
  }

  private createInputOptionsForClaim(
    claim: ClaimConfigurationResource
  ): ClaimInputFieldOptions {
    return new ClaimInputFieldOptions(claim)
  }
}

export const claimFormServiceKey: InjectionKey<ClaimFormService> = Symbol('ClaimFormService')
