/* global describe before after */
// const fs = require('fs')
import chai from 'chai'

import init from '../index'
import SessionServiceMock from 'modularni-urad-utils/mocks/sessionService'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = process.env.PORT || 3333
const g = {
  baseurl: `http://localhost:${port}`,
  mockUser: {},
  sessionBasket: []
}
describe('app', () => {
  before(done => {
    init().then(app => {
      g.sessionSrvcMock = SessionServiceMock(24000, g)
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
    g.sessionSrvcMock.close()
  })

  describe('API', () => {
    //
    const submodules = [
      './questions'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
