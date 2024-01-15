<script setup lang='ts'>

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BasePage from '@/components/BasePage.vue'

const route = useRoute()

const { t } = useI18n()
const errorCode = computed(() => route.query['error_code'])
const details = computed(() => route.query['details'])
const description = computed(() => route.query['description'])

</script>

<template>
  <base-page>
    <div class='card'>
      <div class='card-body'>
        <h5 class='card-title text-center mb-3'>
          {{ t('pages.error.title') }}
        </h5>
        <div class='card-text'>
          {{ errorCode }}
        </div>
        <div class='card-text'>
          {{ details }}
        </div>
        <div class='card-text'>
          {{ description }}
        </div>
      </div>
    </div>
  </base-page>
</template>
