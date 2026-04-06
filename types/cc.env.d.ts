// Cocos Creator 3.8.6 环境类型定义
declare module 'cc.env' {
  export const isMobile: boolean;
  export const isBrowser: boolean;
  export const isNative: boolean;
  export const isEditor: boolean;
  export const isDev: boolean;
  export const isPreview: boolean;
  export const isBuild: boolean;
  export const isJsb: boolean;
  export const isMiniGame: boolean;
  export const platform: string;
  export const os: string;
  export const engineVersion: string;
  export const browserType: string;
  export const nativeVersion: string;
  export const osVersion: string;
  export const osMainVersion: number;
  export const osFamily: string;
  export const language: string;
  export const languageCode: string;
  export const countryCode: string;
}
