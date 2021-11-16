import cors from 'cors'
import express from 'express'
import {
  initErrorHandlers,
  initConfigManager,
  CORSconfigCallback,
  createLoadOrgConfigMW
} from 'modularni-urad-utils'

import questions from './api/questions'
import Mailsend from './api/mailsend'
import Validate from './api/validation'
import apiForward from './api/forward'

export default async function init (mocks = null) {
  await initConfigManager(process.env.CONFIG_FOLDER)

  const app = express()
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))
  const sendMail = await Mailsend(mocks)
  
  const api = express()

  api.get('/', (req, res, next) => {
    const q = questions.getRandom(req.orgconfig)
    res.json(q)
  })

  api.post('/', express.json(), async (req, res, next) => {
    try {
      const data = await Validate(req.body, req.orgconfig)
      const sent = req.body.to 
        ? await sendMail(data, req.orgconfig) 
        : await apiForward(data, req.orgconfig)
      res.json(sent)
    } catch (err) {
      next(err)
    }    
  })

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    return req.params.domain
  })
  app.use('/:domain/', loadOrgConfig, api)

  initErrorHandlers(app)
  return app
}