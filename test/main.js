/* global describe before after */
// const fs = require('fs')
import chai from 'chai'

import init from '../index'
import APIMockInit from './utils/mockAPI'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = Number(process.env.PORT || 3333)

const g = {
  port,
  baseurl: `http://localhost:${port}`,
  mockUser: {},
  sessionBasket: [],
  sentmails: [],
  apimock: {
    basket: [],
    response: { id: 111 }
  }
}
function sendMail (data) {
  return new Promise(resolve => {
    g.sentmails.push(data)
    resolve()
  })
}
describe('app', () => {
  before(done => {
    init({ sendMail }).then(app => {
      g.apiMockServer = APIMockInit(port + 1, g)
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return done(err)
        setTimeout(done, 1500)
      })
    }).catch(done)
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
    g.apiMockServer.close()
  })

  describe('API', () => {
    //
    const submodules = [
      './questions',
      './forward'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
