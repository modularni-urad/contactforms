/* global describe it */
const chai = require('chai')
const should = chai.should()

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)

  const p1 = {
    from: 'gandalf',
    to: 'saruman',
    subject: 'gandalf the grey goes to shire',
    text: 'Plaintext version of the message'
  }
  const q = {}

  return describe('questions', () => {

    it('shall get a question', async () => {
      const res = await r.get('/api.domain1.cz/')
      res.status.should.equal(200)
      should.exist(res.body.id)
      should.exist(res.body.q)
      should.not.exist(res.body.a)
      Object.assign(q, res.body)
    })

    it('must not send message with wrong answer', async () => {
      const wrongData = Object.assign({ id: q.id, a: 'wrong' }, p1)
      const res = await r.post('/api.domain1.cz/').send(wrongData)
      res.status.should.equal(400)
      g.sentmails.length.should.equal(0)
    })

    it('shall send message with right answer', async () => {
      const data = Object.assign({ id: 0, a: 'duben' }, p1)
      const res = await r.post('/api.domain1.cz/').send(data)
      res.status.should.equal(200)
      g.sentmails.length.should.equal(1)
    })
  })
}
