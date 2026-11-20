import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import { useSubmission } from '@/utils/VueUtils'

describe('useSubmission', () => {
  const router = { push: vi.fn() } as unknown as Router

  beforeEach(() => {
    vi.stubGlobal('document', { location: { origin: 'https://auth.example.com' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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

  it('stays busy once the answer moves the person on', async () => {
    const isSubmitting = ref(true)
    const { busy, moveOn } = useSubmission(router, isSubmitting)

    await moveOn('https://client.example.com/callback?code=abc')
    isSubmitting.value = false

    expect(document.location).toBe('https://client.example.com/callback?code=abc')
    expect(busy.value).toBe(true)
  })
})
