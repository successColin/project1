<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import { createRef, findTreeByKey, refs } from 'dsrz/utils'

import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'

import api from '@/request'

const { sms } = findTreeByKey(api, 'login')

defineOptions({
  name: 'LoginPage',
})

const {
  globalConfig: {
    title,
    login: { title: loginTitle, templateList },
  },
} = useAppStore()

const { Login } = useUserStore()

const params = reactive({
  username: 'yba188',
  password: 'Zjkm@123456',
  phone: '',
  code: '',
  captcha: '',
  grant_type: 'sms',
})

interface CaptchaResponse {
  data: {
    id: string
  }
}

const captcha = reactive({
  request: ({ data: { id } }: CaptchaResponse) => {
    const { phone } = params
    if (type.value === 'code-login') {
      countdown.timer = setInterval(() => {
        if (countdown.time > 0) {
          countdown.time--
        } else {
          countdown.time = 60
          clearInterval(countdown.timer)
        }
      }, 1000)
      return sms(
        { phone, captcha: id },
        {
          loading: { text: `发送验证码中...` },
          message: `发送成功`,
        },
      )
    } else {
      return Login(
        Object.assign(params, { captcha: id, grant_type: 'captcha' }),
      )
    }
  },
})

const type = ref('password-login')

const countdown = reactive({
  time: 60,
  timer: undefined as number | undefined,
  start: () => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(params.phone)) {
      ElMessage.warning('请输入正确的手机号')
      return
    }
    refs.captchaRef?.open()
  },
})

const isPasswordLogin = computed(() => type.value === 'password-login')

const handleLogin = () => {
  if (!params.username || !params.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }
  refs.captchaRef?.open()
}
</script>
<template>
  <div class="login">
    <header class="login__head">
      <section class="login__head__left">{{ title }}</section>
    </header>
    <div class="card">
      <main class="login__card">
        <header class="login__card__head">
          <span>{{ loginTitle }}</span>
        </header>
        <template v-if="isPasswordLogin">
          <section class="login__card__item">
            <header>账号</header>
            <el-input
              v-model="params.username"
              placeholder="请输入账号"
              clearable
            />
          </section>
          <section class="login__card__item mt-20">
            <header>密码</header>
            <el-input
              v-model="params.password"
              type="password"
              placeholder="请输入密码"
              clearable
            />
          </section>
        </template>
        <section class="login__card__btn">
          <el-button
            class="login__card__btn--size"
            type="primary"
            @click="handleLogin"
          >
            登录
          </el-button>
        </section>
      </main>
      <CurrencyCaptcha
        :ref="(e: any) => createRef(e, 'captchaRef')"
        :request="captcha.request"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/login-bg.jpg') no-repeat;
  background-size: 100vw 100vh;
  position: relative;
  &__head {
    display: flex;
    justify-content: space-between;
    z-index: 2;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    // background-color: #ffffff;
    // box-shadow: 0 0 10px 2px rgba(2, 2, 2, 0.1);
    &__left {
      font-size: 20px;
    }
    &__right {
      cursor: pointer;
      &--size {
        width: 20px;
        transform: translate(-2px, 4px);
      }
      &__img {
        width: 120px;
        margin: auto;
        display: block;
      }
    }
  }
  .card {
    height: 100%;
    position: absolute;
    right: 30px;
    padding-top: 27vh;
    box-sizing: border-box;
  }
  &__card {
    z-index: 1;
    width: 360px;
    // height: 40vh;
    background-color: #ffffff;
    box-shadow: 0 0 10px 2px rgba(2, 2, 2, 0.1);
    margin: auto;
    border-radius: 10px;
    padding: 40px 30px;
    box-sizing: border-box;
    position: relative;
    &__head {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    &__img {
      width: 0px;
      height: 0px;
      border-width: 50px 0 0 50px;
      border-style: solid;
      border-color: var(--el-color-primary) transparent transparent transparent;
      border-radius: 0 10px 0 0;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      img {
        position: absolute;
        width: 40px;
        height: 40px;
        right: 2px;
        top: -50px;
      }
    }
    &__item {
      width: 100%;
      font-size: 14px;
      header {
        margin-bottom: 10px;
      }
      ::v-deep(.el-input) {
        --el-input-height: 44px;
        --el-input-bg-color: #e8e8e8;
        --el-input-border-color: #e8e8e8;
        --el-input-border-radius: 10px;
        --el-fill-color-light: #e8e8e8;
        --el-color-info: var(--el-color-primary);
        --el-input-hover-border-color: #e8e8e8;
        --el-input-focus-border-color: #e8e8e8;
        margin-bottom: 20px;
      }
      ::v-deep(.el-input-group__append) {
        cursor: pointer;
      }
    }
    &__title {
      text-align: center;
      font-size: 14px;
    }
    &__code {
      margin-top: 10px;
      text-align: center;
      img {
        width: 200px;
        height: 200px;
      }
    }
    &__btn {
      margin-top: 20px;
      &--size {
        width: 100%;
        height: 46px;
        border-radius: 6px;
        font-size: 18px;
      }
    }
    &__foot {
      margin-top: 10px;
      font-size: 14px;
      color: var(--el-color-primary);
      text-align: right;
      cursor: pointer;
    }
  }
}
</style>
