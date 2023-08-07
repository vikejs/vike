/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-23 10:48:42
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 19:15:22
 */
import compression from 'vite-plugin-compression';
import { EnvDevelopmentE } from '@/entity/systemConfig'

export default function createCompression(env: EnvDevelopmentE) {
  const { VITE_BUILD_COMPRESS } = env;
  const compressList = VITE_BUILD_COMPRESS.split(',');
  const plugin = [];
  if (compressList.includes('gzip')) {
    // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
    plugin.push(
      compression({
        ext: '.gz',
        deleteOriginFile: false
      })
    );
  }
  if (compressList.includes('brotli')) {
    plugin.push(
      compression({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile: false
      })
    );
  }
  return plugin;
}
