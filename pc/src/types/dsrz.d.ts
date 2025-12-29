export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    CurrencyButton: typeof import('./../../packages/components/button/index.vue')['default']
    CurrencyCaptcha: typeof import('./../../packages/components/captcha/index.vue')['default']
    CurrencyCard: typeof import('./../../packages/components/card/index.vue')['default']
    CurrencyCascader: typeof import('../../packages/components/cascader/index.vue')['default']
    CurrencyCheckbox: typeof import('./../../packages/components/checkbox/index.vue')['default']
    CurrencyRadio: typeof import('./../../packages/components/radio/index.vue')['default']
  }
}
