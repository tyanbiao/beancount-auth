const Router = require('@koa/router')
const md5 = require('blueimp-md5')

const {
  application: applicationConf,
  beancount: beancountConf,
} = require('../../config')

const router = new Router()

router.get('/', async (ctx, next) => ctx.response.redirect(beancountConf.path))

router.get('/login', async (ctx, next) => {
  await ctx.render('login', {
    title: 'BeancountAuth',
  })
})

router.delete('/logout', async (ctx, next) => {
  ctx.session = null
  return (ctx.body = {
    code: 0,
    message: 'success',
    data: null,
  })
})

router.post('/login', async (ctx, next) => {
  const body = ctx.request.body
  if (
    body.username.trim() === applicationConf.username &&
    body.password.trim() === md5(applicationConf.password)
  ) {
    ctx.session.user = body.username
    ctx.session.signin = true
    return (ctx.body = {
      code: 0,
      message: 'success',
      data: {
        username: applicationConf.username,
        timestamp: Date.now(),
      },
    })
  }
  ctx.body = {
    code: 401,
    message: '用户名或密码错误',
    data: null,
  }
})

module.exports = router
