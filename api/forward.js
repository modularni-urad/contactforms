
export default (ctx) => {

  const _ = ctx.require('underscore')
  const axios = ctx.require('axios')
  
  return async function (body) {
    const data = _.omit(body, 'url')
    const res = await axios.post(body.url, data)
    return res.data
  }
}