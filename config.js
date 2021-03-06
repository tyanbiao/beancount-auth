const beancount = {
  path: '/fava',
  target: 'http://127.0.0.1:5000/fava',
  injectEnabled: true,
  injectContent: '\n<script src="/static/inject.js"></script>',
}

const application = {
  username: 'root', // 登录用户名
  password: 'root', // 登录密码
  host: '127.0.0.1',
  port: 3000,
  sslEnabled: true, // 是否启用 https
  sslCert: 'ssl/server.crt', // 证书
  sslKey: 'ssl/server.key', // 私钥
  sslKeyPassphrase: '', // 私钥密码，可选
}

const session = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 1000 * 60 * 30,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: false /** (boolean) secure cookie*/,
  sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */,
}

module.exports = {
  beancount,
  application,
  session,
  secrets: ['$2y$12$zW43chMYvwsz9BDA', 'jI2kgRm9F37ReX4oKSyPOMO2SN3Ve '],
}
