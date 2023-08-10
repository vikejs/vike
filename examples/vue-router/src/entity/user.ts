/** @description: 登录用户信息 */
interface UserE {
  /** @description:认证信息 */
  token: string
  /** @description:用户编号 */
  id: string
  /** @description:用户名 */
  name: string
  /** @description:用户中文名 */
  nickName: string
  /** @description:用户名 */
  depId: string
  /** @description:部门编号 */
  depName: string
  /** @description:部门名称 */
  avatar: string
  /** @description:用户权限 */
  roles: Array<any>
  /** @description:用户类型 */
  permissions: Array<any>
  /** @description:是否是管理员 */
  isAdmin: boolean
}

export { UserE }
