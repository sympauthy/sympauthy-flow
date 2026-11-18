import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// The tests run through the app's own Vite config: its `@` alias, and its messages for vue-i18n.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
)
