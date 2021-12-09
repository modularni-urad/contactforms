
export default (ctx, questions) => {
  const { ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const verify = ctx.require('hcaptcha').verify

  function validateQuestion (body, config) {
    const validAnswer = questions.validate(body.id, body.a, config)
    if (!validAnswer) throw new ErrorClass(400, 'invalid control answer')
    return _.omit(body, 'id', 'a')
  }
  
  return async function (body, config) {
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
    throw new ErrorClass(400, 'verification failed')
  }
}
