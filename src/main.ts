import { createApp } from 'vue'
import App from '@/App.vue'
import { i18n } from '@/i18n'
import { makeRouter } from '@/router'
import { createPinia } from 'pinia'
import Ajv from 'ajv'
import { ConfigurationApi, configurationApiKey } from '@/client/api/ConfigurationApi'
import { SignInApi, signInApiKey } from '@/client/api/SignInApi'
import { SignUpApi, signUpApiKey } from '@/client/api/SignUpApi'
import { ClaimFormService, claimFormServiceKey } from '@/services/ClaimFormService'
import { ClaimService, claimServiceKey } from '@/services/ClaimsService'
import { ClaimApi, claimApiKey } from '@/client/api/ClaimApi'

const pinia = createPinia()
const router = makeRouter(i18n)

const ajv = new Ajv()
const configurationApi = new ConfigurationApi(pinia)
const signInApi = new SignInApi(pinia)
const signUpApi = new SignUpApi(pinia)
const claimApi = new ClaimApi(pinia)

createApp(App)
  .provide(claimServiceKey, new ClaimService())
  .provide(claimFormServiceKey, new ClaimFormService())
  .provide(configurationApiKey, configurationApi)
  .provide(signInApiKey, signInApi)
  .provide(signUpApiKey, signUpApi)
  .provide(claimApiKey, claimApi)
  .use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
