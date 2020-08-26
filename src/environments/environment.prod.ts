export const environment = {
  production: true,
  API_VERSION: 'api',
  SECURE: window.location.protocol === 'https:',
  API_BASE: window.location.protocol + '//' + window.location.hostname,
  API_URL: 'https://api.duocun.ca/v1/',// 'https://duocun.com.cn/api/', // window.location.origin +
  APP_URL: window.location.origin,
  MEDIA_URL: window.location.origin + '/media/',
  APP: 'duocun',
  AUTH_PREFIX: '',
  GOOGLE_MAP: {
      KEY: 'AIzaSyBotSR2YeQMWKxPl4bN1wuwxNTvtWaT_xc'
  },
  GOOGLE_LOGIN: {
      CLIENT_ID: 'x'
  },
  GOOGLE_ANALYTICS: {
      CLIENT_ID: 'UA-113187324-2'
  },
  STRIPE: {
      CLIENT_KEY: 'x'
  },
  language: 'zh'
};
