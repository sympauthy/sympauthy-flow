import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import { Schema, string } from 'yup'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'
import type { InjectionKey } from 'vue'

export interface ClaimInputOptions {
  getId(): string
}

export class ClaimInputFieldOptions implements ClaimInputOptions {
  constructor(
    readonly claim: ClaimConfiguration
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
  ): Array<ClaimConfiguration> {
    const claimConfigs = configuration.claims || []
    const filteredClaimConfigs: Array<ClaimConfiguration> = []
    for (const claim of claims) {
      const claimConfig = claimConfigs.find((it) => it.id === claim)
      if (claimConfig !== undefined) {
        filteredClaimConfigs.push(claimConfig)
      }
    }
    return filteredClaimConfigs
  }

  /**
   * Return a list of Yup schema validating the provided end-user claims.
   */
  getSchemasForClaims(
    configuration: ConfigurationResource,
    claims: Array<string>
  ): Record<string, Schema> {
    return this.getSchemasForClaimConfigs(this.getConfigForClaims(configuration, claims))
  }

  /**
   * Return a list of Yup schema validating the provided claim configurations.
   */
  getSchemasForClaimConfigs(
    claims: Array<ClaimConfiguration>
  ): Record<string, Schema> {
    const schema: Record<string, Schema> = {}
    for (const claim of claims) {
      schema[claim.id] = this.getSchemaForClaim(claim)
    }
    return schema
  }

  /**
   * Return a Yup schema validating the provided end-user claim.
   *
   * @param claim The end-user claim to validate.
   */
  getSchemaForClaim(
    claim: ClaimConfiguration
  ): Schema {
    let claimSchema: Schema
    switch (claim.type) {
      case 'email':
        claimSchema = string()//.email()
        break
      case 'string':
        claimSchema = string()
        break
      case 'timezone':
        claimSchema = string()
        break
      case 'date':
        claimSchema = string()
        break
      case 'phone_number':
        claimSchema = string().matches(
          /^\+[1-9]\d{1,14}$/,
          'Phone number must be in E.164 format (e.g. +15551234567)'
        )
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
    return this.getOptionsForClaimConfigs(this.getConfigForClaims(configuration, claims))
  }

  /**
   * Return the list of input field and input group to display to the end-user.
   *
   * The list is sorted in the order they must be presented to the end-user.
   */
  getOptionsForClaimConfigs(
    claimConfigs: Array<ClaimConfiguration>
  ): Array<ClaimInputFieldOptions | ClaimInputGroupOptions> {
    const optionsArray: Array<ClaimInputFieldOptions | ClaimInputGroupOptions> = []

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
    claimAndConfigPairs: Array<ClaimConfiguration>
  ): ClaimInputGroupOptions {
    const claimsOptions = claimAndConfigPairs
      .filter((it) => it.group === group)
      .map((claim) => this.createInputOptionsForClaim(claim))
    return new ClaimInputGroupOptions(group, claimsOptions)
  }

  private createInputOptionsForClaim(
    claim: ClaimConfiguration
  ): ClaimInputFieldOptions {
    return new ClaimInputFieldOptions(claim)
  }
}

export const claimFormServiceKey: InjectionKey<ClaimFormService> = Symbol('ClaimFormService')
