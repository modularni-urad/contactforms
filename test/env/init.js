import path, { resolve } from 'path'
import APIMockInit from './mockAPI'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

process.env.DATABASE_URL = ':memory:'
process.env.NODE_ENV = 'test'
// process.env.SESSION_SERVICE_PORT = 24000
// process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
process.env.CONFIG_FOLDER = path.join(__dirname, '../configs')

const port = process.env.PORT || 3333
const g = {
  port,
  baseurl: `http://localhost:${port}`,
  // mockUser: { id: 42 },
  // sessionBasket: []
  sentmails: [],
  apimock: {
    basket: [],
    response: { id: 111 }
  }
}
// g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)

g.InitApp = async function (initFn) {
  const mocks = {
    sendMail: (data) => {
      return new Promise(resolve => {
        g.sentmails.push(data)
        resolve()
      })
    }
  }
  g.apiMockServer = APIMockInit(port + 1, g)
  const app = await initFn(mocks)
  return new Promise((resolve, reject) => {
    g.server = app.listen(g.port, '127.0.0.1', (err) => {
      if (err) reject(err)
      resolve(g)
    })
  })  
}

g.close = async function() {
  g.server.close()
  g.apiMockServer.close()
  // g.sessionSrvcMock.close()
}

module.exports = g