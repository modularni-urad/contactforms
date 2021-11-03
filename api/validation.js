import {verify} from 'hcaptcha'
import questions from './questions'
import _ from 'underscore'

const SECRETKEY = process.env.HCAPTCHA_SECRETKEY
const SITEKEY = process.env.HCAPTCHA_SITEKEY

function validateQuestion (body) {
  const validAnswer = questions.validate(body.id, body.a)
  if (!validAnswer) throw new Error('invalid control answer')
  return _.omit(body, 'id', 'a')
}

export default async function (body) {
  if (body.id !== undefined && body.a !== undefined) {
    return validateQuestion(body)
  }
  if (body.token) {
    const data = await verify(SECRETKEY, body.token, null, SITEKEY)
    if (data.success === true) {
      return _.omit(body, 'token')
    }
  }
  throw new Error('verification failed')
}
