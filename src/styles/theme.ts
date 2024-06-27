export type Theme = {
  activeButtonClasses: string
  disabledButtonClasses: string
}

export const primaryTheme: Theme = Object.freeze({
  activeButtonClasses: 'btn-primary',
  disabledButtonClasses: 'btn-disabled'
})
