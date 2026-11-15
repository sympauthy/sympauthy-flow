import type { NamedValue } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { SA_MESSAGES_EN } from '@sympauthy/design'

const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0]
  } else {
    // @ts-expect-error navigator.userLanguage and navigator.browserLanguage are non-standard
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'
  }
}

export const i18n = createI18n({
  locale: getNavigatorLanguage(),
  fallbackLocale: 'en',
  messages: messages,

  // Remove warning when translation is missing
  fallbackWarn: false,
  missingWarn: false
})

// The words the design system's components say the same on every screen, under `sa`.
// English is the only language the flow holds, so it is the only one they are added to.
i18n.global.mergeLocaleMessage('en', SA_MESSAGES_EN)

export function translateMessage(messageKey: string, values?: NamedValue): string {
  if (!values) {
    values = {}
  }
  const { t } = i18n.global
  return t(messageKey, values)
}
