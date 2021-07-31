import express from 'express'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import _ from 'underscore'
import questions from './api/questions'
import Mailsend from './api/mailsend'
import apiForward from './api/forward'

export default async function init (mocks = null) {
  const app = express()
  const sendMail = await Mailsend(mocks)
  
  app.get('/', (req, res, next) => {
    const q = questions.getRandom()
    res.json(q)
  })

  app.post('/', express.json(), (req, res, next) => {
    const validAnswer = questions.validate(req.body.id, req.body.a)
    if (!validAnswer) throw new Error('invalid control answer')
    const data = _.omit(req.body, 'id', 'a')
    const action = req.body.to ? sendMail(data) : apiForward(data)
    action.then(sent => { res.json(sent) }).catch(next)
  })

  initErrorHandlers(app)
  return app
}