import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { i18n } from '@/i18n'
import { router } from '@/router'
import { createPinia } from 'pinia'
import Ajv from 'ajv'
import { ConfigurationApi, configurationApiKey } from '@/client/api/ConfigurationApi'

const ajv = new Ajv()
const configurationApi = new ConfigurationApi()

const pinia = createPinia()
createApp(App)
  .use(router)
  .use(i18n)
  .use(pinia)
  .provide(configurationApiKey, configurationApi)
  .mount('#app')
