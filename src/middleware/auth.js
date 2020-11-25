const pathMatch = require('path-match')

const matcher = pathMatch({
  // path-to-regexp options
  sensitive: false,
  strict: false,
  end: false,
})

const matchRoute = (url, routes = []) => {
  let res = false
  for (let i = 0; i < routes.length; i++) {
    const match = matcher(routes[i])
    if (match(url)) {
      res = true
      break
    }
  }
  return res
}

const auth = (ctx) => {
  return ctx.session && ctx.session.user && ctx.session.signin
}

module.exports = (options) => async (ctx, next) => {
  if (options.default && options.default === 'private') {
    if (matchRoute(ctx.path, options.exclude) || auth(ctx)) return await next()
    return ctx.response.redirect(
      `/login?redirect=${encodeURIComponent(ctx.url)}`,
    )
  }
  if (options.default && options.default === 'public') {
    if (!matchRoute(ctx.path, options.exclude) || auth(ctx)) return await next()
    return ctx.response.redirect(
      `/login?redirect=${encodeURIComponent(ctx.url)}`,
    )
  }
  await next()
}
