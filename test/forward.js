/* global describe it */
const chai = require('chai')
const should = chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p1 = {
    url: `http://localhost:${g.port + 1}/`,
    email: 'saruman',
    subject: 'prihlaska',
    text: 'Plaintext version of the message'
  }
  const q = {}

  return describe('forward', () => {

    it('shall forward body to url', async () => {
      const data = Object.assign({ id: 0, a: 'duben' }, p1)
      const res = await r.post('/').send(data).set('Host', 'api.domain1.cz')
      res.status.should.equal(200)
      console.log(g.apimock.basket);
      // g.sentmails.length.should.equal(1)
    })
  })
}
