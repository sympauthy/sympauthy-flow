import { createApp } from 'vue'
import App from '@/App.vue'
import { i18n } from '@/i18n'
import { makeRouter } from '@/router'
import { createPinia } from 'pinia'
import { ConfigurationApi, configurationApiKey } from '@/client/api/ConfigurationApi'
import { SignInApi, signInApiKey } from '@/client/api/SignInApi'
import { SignUpApi, signUpApiKey } from '@/client/api/SignUpApi'
import { ClaimFormService, claimFormServiceKey } from '@/services/ClaimFormService'
import { ClaimService, claimServiceKey } from '@/services/ClaimsService'
import { ClaimApi, claimApiKey } from '@/client/api/ClaimApi'
import { TimeZoneApi, timeZoneApiKey } from '@/client/api/TimeZoneApi'

const pinia = createPinia()
const router = makeRouter(i18n)

createApp(App)
  .provide(claimServiceKey, new ClaimService())
  .provide(claimFormServiceKey, new ClaimFormService())
  .provide(configurationApiKey, new ConfigurationApi(pinia))
  .provide(signInApiKey, new SignInApi(pinia))
  .provide(signUpApiKey, new SignUpApi(pinia))
  .provide(claimApiKey, new ClaimApi(pinia))
  .provide(timeZoneApiKey, new TimeZoneApi(pinia))
  .use(router)
  .use(i18n)
  .use(pinia)
  .mount('#app')
