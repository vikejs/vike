/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-23 11:04:28
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 17:14:21
 */
import cache from './cache';

function getToken(): string | undefined | null {
  // return Cookies.get(TokenKey);
  return cache.session.get('authorization');
}

function setToken(token: string | object): void {
  return cache.session.set('authorization', token.toString());
  // return Cookies.set(TokenKey, token.toString());
}

function removeToken(): void {
  return cache.session.remove('authorization');
  // return Cookies.remove(TokenKey);
}

export { getToken, setToken, removeToken };
