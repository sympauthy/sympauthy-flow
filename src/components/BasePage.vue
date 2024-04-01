<script setup lang='ts'></script>

<template>
  <div class='w-full text-center py-5'>
    <p class='text-3xl mb-1'>SympAuthy</p>
    <p class='text-sm' style='color: var(--color-on-body);'>
      A simple, self-hosted and open source OAuth 2/OpenID authorization server.
    </p>
  </div>
  <slot />
  <i18n-t keypath='pages.base.footer' tag='p' class='w-full text-center text-sm mt-5' style='color: var(--color-on-body);'>
    <a class='underline' href='https://github.com/sympauthy' target='_blank'>SympAuthy</a>
  </i18n-t>
</template>
