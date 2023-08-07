/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-04 17:39:02
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 19:18:43
 */
import { ProxyOptions, defineConfig, loadEnv } from 'vite'
import path from 'path'

import createVitePlugins from './renderer/vite'
import { EnvDevelopmentE } from '@/entity/systemConfig'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd()) as unknown as EnvDevelopmentE
  const plugins = createVitePlugins(env, command === 'build')
  // 处理使用import.meta.env jest 测试报错问题
  const envWithProcessPrefix = Object.entries(env).reduce((prev, [key, val]) => {
    return {
      ...prev,
      // 环境变量添加process.env
      ['process.env.' + key]: `"${val}"`
    }
  }, {})
  // 处理代理地址
  const envKeys: Array<string> = []
  for (const item in env) {
    if (item.indexOf('API') > -1) {
      envKeys.push(item)
    }
  }
  // 自动代理
  const proxy: Record<string, ProxyOptions> = {}
  for (const item of envKeys) {
    if (item.includes('API_URL')) {
      const api = item.replace('_URL', '')
      if (envKeys.includes(api)) {
        proxy[`/${env[api]}/`] = {
          target: env[item],
          changeOrigin: true,
          rewrite: (p) => p.replace(`/${env[api]}/`, '')
        } as ProxyOptions

        if (api.includes('SIGNALR')) {
          proxy[`/${env[api]}/`].ws = true
        }
      }
    }
  }

  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://rh.tect.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://rh.tect.com/admin/，则设置 baseUrl 为 /admin/。
    optimizeDeps: { include: ['cross-fetch'] },
    base: env.VITE_APP_ENV === 'development' ? '/' : '/application/broadcast/',
    build: {
      minify: false
      // sourcemap: true
    },
    plugins,
    define: envWithProcessPrefix,
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './renderer')
      }
    },
    // vite 相关配置
    server: {
      port: 83,
      host: true,
      open: true,
      proxy
    }
  }
})
