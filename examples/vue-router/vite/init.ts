/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-23 10:25:24
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-10 17:01:52
 */

import md from 'vite-plugin-md'
import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { EnvDevelopmentE } from '@/entity/systemConfig'

export default function createVitePlugins(viteEnv: EnvDevelopmentE, isBuild = false) {
  const vitePlugins = [vue({ include: [/\.vue$/, /\.md$/] })]
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  vitePlugins.push(ssr({ prerender: true }))
  vitePlugins.push(md())
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
