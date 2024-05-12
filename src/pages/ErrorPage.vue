<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BasePage from '@/components/BasePage.vue'
import BaseCard from '@/components/card/BaseCard.vue'

const route = useRoute()

const { t } = useI18n()
const errorCode = computed(() => route.query['error_code'])
const details = computed(() => route.query['details'])
const description = computed(() => route.query['description'])
</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <base-card>
        <template v-slot:title>
          {{ t('pages.error.title') }}
        </template>
        <p class='mb-3'>
          {{ description }}
        </p>
        <hr class='m-3'>
        <p class='text-sm' style='color: var(--color-on-body);'>
          {{ errorCode }} - {{ details }}
        </p>
      </base-card>
    </div>
  </base-page>
</template>
