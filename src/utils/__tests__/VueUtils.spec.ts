import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import { linkAttributes, useSubmission } from '@/utils/VueUtils'

describe('useSubmission', () => {
  const router = { push: vi.fn() } as unknown as Router

  beforeEach(() => {
    vi.stubGlobal('document', { location: { origin: 'https://auth.example.com' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.mocked(router.push).mockReset()
  })

  it('is busy only while the submission is on its way when it fails', () => {
    const isSubmitting = ref(false)
    const { busy } = useSubmission(router, isSubmitting)
    expect(busy.value).toBe(false)

    isSubmitting.value = true
    expect(busy.value).toBe(true)

    isSubmitting.value = false
    expect(busy.value).toBe(false)
  })

  it('stays busy while another page loads', async () => {
    const isSubmitting = ref(true)
    const { busy, moveOn } = useSubmission(router, isSubmitting)

    await moveOn('https://client.example.com/callback?code=abc')
    isSubmitting.value = false

    expect(document.location).toBe('https://client.example.com/callback?code=abc')
    expect(busy.value).toBe(true)
  })

  it('is idle again once a move within the app is over', async () => {
    const isSubmitting = ref(true)
    const { busy, moveOn } = useSubmission(router, isSubmitting)

    await moveOn('https://auth.example.com/claims/validate?media=sms&state=abc')
    isSubmitting.value = false

    expect(router.push).toHaveBeenCalled()
    expect(busy.value).toBe(false)
  })

  it('is idle again when a move within the app fails', async () => {
    vi.mocked(router.push).mockRejectedValue(new Error('aborted'))
    const isSubmitting = ref(true)
    const { busy, moveOn } = useSubmission(router, isSubmitting)

    await expect(moveOn('https://auth.example.com/sign-up?state=abc')).rejects.toThrow()
    isSubmitting.value = false

    expect(busy.value).toBe(false)
  })
})

describe('linkAttributes', () => {
  it('gives the link its href', () => {
    expect(linkAttributes('https://auth.example.com/cancel', false)).toEqual({
      href: 'https://auth.example.com/cancel'
    })
  })

  it('takes the href away while disabled', () => {
    expect(linkAttributes('https://auth.example.com/cancel', true)).toEqual({
      role: 'link',
      'aria-disabled': 'true'
    })
  })
})
