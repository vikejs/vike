/**
 * @description:开发环境配置项
 */
interface EnvDevelopmentE {
  /**
   * @description:页面标题
   */
  VITE_APP_TITLE: string | ''
  /**
   * @description:开发环境配置
   */
  VITE_APP_ENV: string | ''
  /**
   * @description: 是否在打包时开启压缩，支持 gzip 和 brotli
   */
  VITE_BUILD_COMPRESS: string | ''
}

export { EnvDevelopmentE }
