export class SignInService {
  /**
   * Return the name of the sign-in claims formatted to be displayed to the end-user.
   */
  async getSignInClaimNames(): Promise<string> {
    return 'Login' // FIXME
  }
}
