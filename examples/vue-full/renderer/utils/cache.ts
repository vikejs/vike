/*
 * @Descripttion:
 * @version: v1.0
 * @Author: LiWen
 * @Date: 2022-02-24 10:09:10
 * @LastEditors: LiWen
 * @LastEditTime: 2023-08-07 19:39:26
 */
const sessionCache = {
  set(key: string, value: string) {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  },
  get(key: string) {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON<T>(key: string): T | null {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key);
  }
};
const localCache = {
  set(key: string, value: string) {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value);
    }
  },
  get(key: string): string | null {
    if (!localStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }

    return localStorage.getItem(key);
  },
  setJSON(key: string, jsonValue: object) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON<T>(key: string): T | null {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  },
  remove(key: string) {
    localStorage.removeItem(key);
  }
};

export default {
  /**
     * 会话级缓存
     */
  session: sessionCache,
  /**
     * 本地缓存
     */
  local: localCache
};
