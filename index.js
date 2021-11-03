import express from 'express'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import questions from './api/questions'
import Mailsend from './api/mailsend'
import Validate from './api/validation'
import apiForward from './api/forward'

export default async function init (mocks = null) {
  const app = express()
  const sendMail = await Mailsend(mocks)
  
  app.get('/', (req, res, next) => {
    const q = questions.getRandom()
    res.json(q)
  })

  app.post('/', express.json(), async (req, res, next) => {
    try {
      const data = await Validate(req.body)
      const sent = req.body.to 
        ? await sendMail(data) 
        : await apiForward(data)
      res.json(sent)
    } catch (err) {
      next(err)
    }    
  })

  initErrorHandlers(app)
  return app
}