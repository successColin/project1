import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    const { VITE_BASE_API, VITE_BASE_URL, VITE_BASE_ROUTE } = env
    return {
        base: VITE_BASE_ROUTE,
        esbuild: { pure: ['console.log'], drop: ['debugger'], legalComments: 'none' },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/element/index.scss" as *;`,
                    api: 'modern-compiler'
                }
            }
        },
        plugins: [
            vue(),
            vueJsx(),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: "sass"
                    }),
                ],
                dts: 'src/types/components.d.ts',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                'dsrz': fileURLToPath(new URL('./packages', import.meta.url))
            }
        },
        server: {
            host: '0.0.0.0',
            port: 9527,
            open: true,
            // 跨域的写法
            proxy: {
                [VITE_BASE_API]: {
                    target: VITE_BASE_URL, // 实际请求地址
                    changeOrigin: true,
                    rewrite: (path) => path.replace(new RegExp(`^${VITE_BASE_API}`), '')
                }
            }
        },
        ssr: {
            // TODO: workaround until they support native ESM
            noExternal: ['element-plus'],
        },
    }
}
)
