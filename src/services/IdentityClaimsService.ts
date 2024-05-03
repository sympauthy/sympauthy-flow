import { ClaimInputFieldOptions, type ClaimInputGroupOptions } from '@/services/ClaimFormService'
import { OpenIdClaim } from '@/utils/OpenIdClaim'

/**
 * Service controlling which claims of the group identity (name, given_name, etc.) should be
 * presented to the end-user based on the configuration.
 */
export class IdentityClaimsService {

  getNameOptions(options: ClaimInputGroupOptions): ClaimInputFieldOptions | undefined {
    return options.getClaimOptions(OpenIdClaim.NAME)
  }

  getGivenNameOptions(options: ClaimInputGroupOptions): ClaimInputFieldOptions | undefined {
    return options.getClaimOptions(OpenIdClaim.GIVEN_NAME)
  }

  getMiddleNameOptions(options: ClaimInputGroupOptions): ClaimInputFieldOptions | undefined {
    return options.getClaimOptions(OpenIdClaim.MIDDLE_NAME)
  }

  getFamilyNameOptions(options: ClaimInputGroupOptions): ClaimInputFieldOptions | undefined {
    return options.getClaimOptions(OpenIdClaim.FAMILY_NAME)
  }

  isNameRequired(options: ClaimInputGroupOptions): boolean {
    return this.getNameOptions(options)?.claim?.required === true
  }

  isSplitCollectable(options: ClaimInputGroupOptions): boolean {
    const splitOptions = [
      this.getGivenNameOptions(options),
      this.getMiddleNameOptions(options),
      this.getFamilyNameOptions(options)
    ]
    return splitOptions.some(it => it !== undefined)
  }

  isSplitRequired(options: ClaimInputGroupOptions): boolean {
    const splitOptions = [
      this.getGivenNameOptions(options),
      this.getMiddleNameOptions(options),
      this.getFamilyNameOptions(options)
    ]
    return splitOptions.some(it => it?.claim?.required === true)
  }

  /**
   * Display the name if:
   * - it is collectable.
   * - the name claims is required
   * - none of the other name claims are available.
   */
  shouldDisplayName(options: ClaimInputGroupOptions): boolean {
    if (this.getNameOptions(options) === undefined) {
      return false
    }
    if (this.isNameRequired(options)) {
      return true
    }
    return !isSplitCollectable.value
  }

  /**
   * Display the given_name, middle_name and family_name claims if:
   * - one of them is collectable.
   * - one of them is required.
   * - the name should not be displayed.
   */
  shouldDisplaySplitName(options: ClaimInputGroupOptions): boolean {
    if (!this.isSplitCollectable(options)) {
      return false
    }
    if (this.isSplitRequired(options)) {
      return true
    }
    return !this.shouldDisplayName(options)
  }
}
