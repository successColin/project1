export default {
  login: { url: '/club-auth/oauth2/token', method: 'post' },
  sms: { url: '/club-auth/v1/sms/login', method: 'post' },
  permission: { url: '/club-auth/v1/account/menu', method: 'get' },
  details: { url: '/club-auth/v1/account/auth', method: 'get' },
}
