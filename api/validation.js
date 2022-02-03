import _ from 'underscore'
import { verify } from 'hcaptcha'
import { APIError } from 'modularni-urad-utils'
import questions from './questions'

function validateQuestion (body, config) {
  const validAnswer = questions.validate(body.id, body.a, config)
  if (!validAnswer) throw new APIError(400, 'invalid control answer')
  return _.omit(body, 'id', 'a')
}
  
export default async function (body, config) {
  if (body.id !== undefined && body.a !== undefined) {
    return validateQuestion(body)
  }
  if (body.token) {
    const data = await verify(
      config.contactforms.HCAPTCHA_SECRETKEY, 
      body.token, 
      config.contactforms.HCAPTCHA_REMOTEIP | null, 
      config.contactforms.HCAPTCHA_SITEKEY | null)
    if (data.success === true) {
      return _.omit(body, 'token')
    }
  }
  throw new APIError(400, 'verification failed')
}
