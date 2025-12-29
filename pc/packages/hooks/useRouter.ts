import { useRouter } from 'vue-router'

import { GlobalConfig } from 'dsrz/components/config'
import { isBoolean, isNumber } from 'dsrz/utils'

export const useRouterJump = () => {
  const router = useRouter()

  const routerPush = <T>(name: string, params: T) =>
    router.push({
      name,
      state: {
        params: Object.assign({}, params),
      },
    })

  const routerBack = (name: string, index?: number, visible?: boolean) => {
    if (isNumber(index)) {
      router.go(index)
    } else if (router.options.history.state.back) {
      router.back()
    } else {
      router.replace({ name })
    }
    if (isBoolean(visible)) {
      GlobalConfig.elTable.update(visible)
    }
  }

  return { routerPush, routerBack }
}
