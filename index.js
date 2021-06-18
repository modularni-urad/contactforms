import express from 'express'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import _ from 'underscore'
import questions from './api/questions'
import { sendMail } from './api/mailsend'

export default async function init (mocks = null) {
  const app = express()
  
  app.get('/', (req, res, next) => {
    const q = questions.getRandom()
    res.json(q)
  })

  app.post('/', express.json(), (req, res, next) => {
    const validAnswer = questions.validate(req.body.id, req.body.a)
    if (!validAnswer) throw new Error('invalid control answer')
    sendMail(_.omit(req.body, 'id', 'a'))
      .then(sent => { res.json(sent) })
      .catch(next)
  })

  initErrorHandlers(app)
  return app
}