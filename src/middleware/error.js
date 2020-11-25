module.exports = () => async (ctx, next) => {
  await next()
  if (ctx.res.statusCode === 404) {
    return await ctx.render('404')
  }
  if (ctx.res.statusCode === 500) {
    return await ctx.render('500')
  }
}
