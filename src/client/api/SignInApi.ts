import { AbstractApi } from '@/client/api/AbstractApi'
import { type SignInOptionsResource, signInOptionsResourceSchema } from '@/client/model/SignInOptionsResource'

export class SignInApi extends AbstractApi {

  async getOptions(state: string): Promise<SignInOptionsResource> {
    return this.get({
      path: 'https://localhost:8092/api/flow/1.0/sign-in',
      state: state,
      schema: signInOptionsResourceSchema
    })
  }
}


