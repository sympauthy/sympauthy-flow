import { defineStore } from 'pinia'
import { isStringNotBlankNorEmpty } from '@/utils/StringUtils'

export const useState = defineStore('state', () => {
  const state = (): string => {
    const params = new URLSearchParams(document.location.search)

    let state: string | undefined

    const stateValues = params.getAll('state')
    if (stateValues.length > 0) {
      state = stateValues[0]
    }

    if (isStringNotBlankNorEmpty(state)) {
      return state
    } else {
      throw new Error('state query param is missing or blank.')
    }
  }

  return { state }
})
