const path = require('path')
const fs = require('fs')
const https = require('https')
const http = require('http')
const Koa = require('koa')
const session = require('koa-session')
const views = require('koa-views')
const server = require('koa-static')
const bodyParser = require('koa-bodyparser')
const mount = require('koa-mount')
const proxy = require('./middleware/proxy')
const userAuth = require('./middleware/auth')
const router = require('./middleware/router')
const error = require('./middleware/error')
const {
  session: sessionConf,
  secrets,
  application: applicationConf,
  beancount: beancountConf,
} = require('../config')

const app = new Koa()

app.keys = secrets

// 模板引擎中间件
app.use(
  views(path.join(__dirname, './view'), {
    extension: 'ejs',
  }),
)

// 错误处理
app.use(error())

// session中间件
app.use(session(sessionConf, app))

// 身份认证中间件
app.use(
  userAuth({
    default: 'private',
    exclude: ['/login', '/static'],
  }),
)

// 静态资源中间件
app.use(mount('/static', server(path.join(__dirname, './static'))))

// 反向代理中间件
app.use(mount(beancountConf.path, proxy({target: beancountConf.target})))

// bodyparser 中间件
app.use(bodyParser())

// 路由中间件
app.use(router.routes()).use(router.allowedMethods())

const {port, host} = applicationConf

if (applicationConf.sslEnabled) {
  const options = {
    key: fs.readFileSync(path.resolve(process.cwd(), applicationConf.sslKey)),
    cert: fs.readFileSync(path.resolve(process.cwd(), applicationConf.sslCert)),
    passphrase: applicationConf.sslKeyPassphrase,
  }
  https.createServer(options, app.callback()).listen(port, host, () => {
    console.log(`application is running on https://${host}:${port}`)
  })
} else {
  http.createServer(app.callback()).listen(port, host, () => {
    console.log(`application is running on http://${host}:${port}`)
  })
}
