const http = require('http')
const url = require('url')
const {injectContent} = require('../../config').beancount

module.exports = (request, response, options) => {
  return new Promise((resolve, reject) => {
    const pRequest = http
      .request(options)
      .on('response', (pResonse) => {
        Object.keys(pResonse.headers).forEach((key) =>
          response.setHeader(key, pResonse.headers[key]),
        )
        response.statusCode = pResonse.statusCode
        if (contentIsHTML(pResonse)) {
          const bufferArr = []
          pResonse.on('data', (chunk) => bufferArr.push(chunk))
          pResonse.on('end', () => {
            bufferArr.push(Buffer.from(injectContent, 'utf8'))
            const body = Buffer.concat(bufferArr)
            response.setHeader('content-length', body.length)
            response.end(body)
            resolve()
          })
        } else {
          if (pResonse.statusCode === 302 || pResonse.statusCode === 301) {
            response.setHeader(
              'location',
              convertLocation(response.getHeader('location')),
            )
          }
          response.setHeader('X-Forwarded-Proto', 'https')
          pResonse.pipe(response)
          pResonse.on('end', resolve)
        }
      })
      .on('timeout', () => reject(new Error('Proxy request timeout')))
      .on('error', (e) => reject(e))
    request.pipe(pRequest)
    response.on('close', () =>
      reject(new Error('response closed while proxying ')),
    )
    response.on('finish', resolve)
  })
}

function contentIsHTML(resonseIncoming) {
  const contentType = resonseIncoming.headers['content-type']
  const statusCode = resonseIncoming.statusCode
  return (
    statusCode >= 200 &&
    statusCode < 300 &&
    contentType &&
    contentType.indexOf('text/html') === 0
  )
}

// 去除 302 location 中的协议，fava 重定向会默认使用 http 协议
function convertLocation(location) {
  if (!location) {
    return location
  }
  return location.replace(/^https?\:/i, '')
}
