import { defineStore } from 'pinia'
import { isBlankOrEmpty } from '@/utils/StringUtils'

export const useState = defineStore('state', () => {
  const state = (): string => {
    const params = new URLSearchParams(document.location.search)

    let state: string | undefined

    const stateValues = params.getAll('state')
    if (stateValues.length > 0) {
      state = stateValues[0]
    }

    if (state === undefined || isBlankOrEmpty(state)) {
      throw new Error('state query param is missing or blank.')
    }
    return state
  }

  /**
   * Redirect the end-user to an external url that is protected by the state.
   *
   * This function will automatically append the state before redirecting the user.
   *
   * @param url
   */
  const redirectToAuthenticatedUrl = (url: string) => {
    const uri = new URL(url)
    uri.searchParams.append('state', state())
    document.location = uri.toString()
  }

  return { state, redirectToAuthenticatedUrl }
})
