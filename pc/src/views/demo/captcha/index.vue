<script lang="ts" setup>
import { createRef, refs } from 'dsrz/utils'
import { reactive } from 'vue'
import type { CaptchaResponse } from './types'

defineOptions({
  name: 'CurrencyCaptchaPage',
})

const captcha = reactive({
  request: ({ data: { id } }: CaptchaResponse) => id,
})

const handleCaptcha = () => refs.captchaRef?.open()
</script>
<template>
  <div>
    <CurrencyButton title="图形验证" type="primary" @click="handleCaptcha" />
    <CurrencyCaptcha
      :ref="(e: any) => createRef(e, 'captchaRef')"
      :request="captcha.request"
    />
  </div>
</template>
