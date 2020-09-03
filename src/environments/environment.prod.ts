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
  language: 'zh'
};
