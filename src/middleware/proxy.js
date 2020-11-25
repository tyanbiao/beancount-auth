const url = require('url')
const http = require('http')
const {injectEnabled} = require('../../config').beancount
const injectProxy = require('./inject')

const proxyAgent = new http.Agent({keepAlive: true})

module.exports = (options) => (ctx, _next) => {
  const {req, res} = ctx
  const {method, headers} = req
  const {hostname, port = 80, path = '/'} = url.parse(options.target)
  const requestOptions = {
    hostname,
    port,
    path: path + url.parse(req.url).path,
    method,
    headers,
    agent: proxyAgent,
  }
  if (
    injectEnabled &&
    headers['accept'] &&
    headers['accept'].indexOf('text/html') !== -1
  ) {
    return injectProxy(req, res, requestOptions)
  } else {
    return transparentProxy(req, res, requestOptions)
  }
}

function transparentProxy(request, response, options) {
  return new Promise((resolve, reject) => {
    const pRequest = http
      .request(options)
      .on('response', (pResonse) => {
        response.writeHead(pResonse.statusCode, pResonse.headers)
        pResonse.pipe(response)
        pResonse.on('end', resolve)
      })
      .on('timeout', () => reject(new Error('proxy timeout')))
      .on('error', (e) => reject(e))
    request.pipe(pRequest)
    response.on('close', () =>
      reject(new Error('Http response closed while proxying ')),
    )
    response.on('finish', resolve)
  })
}
