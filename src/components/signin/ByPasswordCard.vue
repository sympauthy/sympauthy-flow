<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class='card'>
    <div class='card-body'>
      <h5 class='card-title w-100 text-center'>
        {{ t('sign_in.password.title') }}
      </h5>
      <div class='mt-3 w-100 text-center'>
        <i18n-t keypath='sign_in.password.no_account'>
          <a>{{ t('sign_in.password.sign_up') }}</a>
        </i18n-t>
      </div>

      <div>
        <label for='identifier' class='form-label'></label>
        <input id='identifier'
               type='text'
               class='form-control'>
      </div>

      <div class='mt-3'>
        <label for='password' class='form-label'>
          {{ t('common.password') }}
        </label>
        <input id='password'
               type='text'
               class='form-control'>
      </div>
      <div class='mt-1 w-100 text-end'>
        <a>{{ t('sign_in.password.forgotten_password') }}</a>
      </div>

      <button class='btn btn-primary w-100 mt-5'>
        {{ t('common.sign_in') }}
      </button>

    </div>
  </div>
</template>

<style scoped>

</style>
