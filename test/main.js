/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const g = require('./env/init')

describe('app', () => {
  before(() => {
    const TestedModule = require('../index')
    return g.InitApp(TestedModule.default)
  })
  after(g.close)

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
