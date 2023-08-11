/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-23 10:16:59
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-11 11:01:38
 */
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { OptimizeOptions } from 'svgo';

const createSvgIcon = (isBuild: boolean | OptimizeOptions) => {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'renderer/assets/icons/svg')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild
  });
}

export default createSvgIcon