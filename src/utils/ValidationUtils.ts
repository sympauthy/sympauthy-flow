import { defaultLocale, string } from 'yup'
import { isStringNotBlankNorEmpty } from '@/utils/StringUtils'

/**
 * Schema of a text that must hold something other than spaces, a blank one being refused as a
 * missing one is. The value is checked, never trimmed: what is sent is what was typed.
 */
export function notBlankString(label: string) {
  return string()
    .required()
    .test({
      name: 'not-blank',
      message: defaultLocale.mixed?.required,
      test: (value) => isStringNotBlankNorEmpty(value)
    })
    .label(label)
}
