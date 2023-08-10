/*
 * @Descripttion: 状态管理
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2023-08-07 14:32:14
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 17:18:18
 */
import { defineStore } from 'pinia'
import { UserE } from '../../entity/user'

/** @description: 用户信息 */
const userInfo: UserE = {
  token: '',
  id: '',
  name: '',
  nickName: '',
  depId: '',
  depName: '',
  avatar: '',
  roles: [],
  permissions: [],
  isAdmin: false
}

export const userStore = defineStore('user', {
  state: () => ({
    user: userInfo
  }),
  getters: {
    /** @description: 用户ID */
    id: (state) => state.user.id,
    /** @description: 用户名称 */
    name: (state) => state.user.name
  },
  actions: {
    setName(name: string) {
      userInfo.name = name
    }
  }
})
