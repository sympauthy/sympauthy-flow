import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { i18n } from '@/i18n'
import { router } from '@/router'
import { createPinia } from 'pinia'
import Ajv from 'ajv'
import { ConfigurationApi, configurationApiKey } from '@/client/api/ConfigurationApi'
import { SignInApi, signInApiKey } from '@/client/api/SignInApi'

const pinia = createPinia()

const ajv = new Ajv()
const configurationApi = new ConfigurationApi(pinia)
const signInApi = new SignInApi(pinia)

createApp(App)
  .use(router)
  .use(i18n)
  .use(pinia)
  .provide(configurationApiKey, configurationApi)
  .provide(signInApiKey, signInApi)
  .mount('#app')
