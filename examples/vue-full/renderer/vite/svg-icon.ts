/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-23 10:16:59
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 18:37:31
 */
import { Plugin } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { OptimizeOptions } from 'svgo';

export default function createSvgIcon(isBuild: boolean | OptimizeOptions): Plugin {
  return createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'renderer/assets/icons/svg')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: isBuild
  });
}
