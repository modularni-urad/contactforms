import questions from './api/questions'
import validate from './api/validation'
import forward from './api/forward'

export default function initContactforms (ctx) {
  const { bodyParser, express, sendMail } = ctx
  const api = express()

  api.get('/', (req, res, next) => {
    const q = questions.getRandom(req.tenantcfg)
    res.json(q)
  })

  api.post('/', bodyParser, async (req, res, next) => {
    try {
      const data = await validate(req.body, req.tenantcfg)
      const sent = req.body.to
        ? await sendMail(data) 
        : await forward(data)
      res.json(sent)
    } catch (err) {
      next(err)
    }
  })

  return api
}