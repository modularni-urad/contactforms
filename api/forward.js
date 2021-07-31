import axios from 'axios'
import _ from 'underscore'

export default async function (body) {
  const data = _.omit(body, 'url')
  const res = await axios.post(body.url, data)
  return res.data
}