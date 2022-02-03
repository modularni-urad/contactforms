import path from 'path'
import express from 'express'
import APIMockInit from './mockAPI'
import { initErrorHandlers, APIError } from 'modularni-urad-utils'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.NODE_ENV = 'test'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`

  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: [],
    sentmails: [],
    apimock: {
      basket: [],
      response: { id: 111 }
    }
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  g.apiMockServer = APIMockInit(port + 1, g)

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default

    const app = express()
    const appContext = { 
      express, auth,
      sendMail: (body) => {
        g.sentmails.push(body)
      },
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    const mwarez = ApiModule(appContext)
    app.use(mwarez)

    initErrorHandlers(app)

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  g.close = async function() {
    g.sessionSrvcMock.close()
    g.server.close()
    g.apiMockServer.close()
  }
}