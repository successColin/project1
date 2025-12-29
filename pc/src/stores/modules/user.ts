import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import {
  aesDecrypt,
  aesEncrypt,
  cookiesStorage,
  deepClone,
  findTreeByKey,
} from 'dsrz/utils'

import api from '@/request'
import useAppStore from './app'
import usePermissionStore from './permission'

const { login } = findTreeByKey(api, 'login')

interface User {
  userName?: string
  phonenumber?: string
  nickName?: string
  userRole?: number
}

interface LoginParams {
  username: string
  password: string
}

const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref<User>({})

  const setUser = (value: User) => {
    value.nickName = aesDecrypt(value.nickName)
    value.phonenumber = aesDecrypt(value.phonenumber)
    value.userName = aesDecrypt(value.userName)
    user.value = value
  }

  const getUser = () => user.value

  const setToken = (value: string) => cookiesStorage.setItem('token', value)

  const getToken = () => cookiesStorage.getItem('token')

  const resetToken = () => {
    const { setRoutes } = usePermissionStore()
    cookiesStorage.removeItem('token')
    user.value = {}
    setRoutes([])
    if (import.meta.env.VITE_SSO_URL) {
      window.location.href = import.meta.env.VITE_SSO_URL
    }
  }

  const Login = async (params: LoginParams) => {
    const date = deepClone(params)
    const encryptList = ['username', 'password']
    const formData = new FormData()
    Object.entries(date).forEach(([key, value]) => {
      if (encryptList.includes(key))
        date[key as keyof LoginParams] = aesEncrypt(value)
      formData.append(key, date[key as keyof LoginParams])
    })
    const {
      globalConfig: { auth },
    } = useAppStore()
    const {
      data: { accessToken },
    } = await login(formData, { auth })
    setToken(accessToken)
    router.push('/')
  }

  return { user, setUser, getUser, setToken, getToken, resetToken, Login }
})

export default useUserStore
