import Questions from './api/questions'
import Validate from './api/validation'
import Forward from './api/forward'

export async function migrateDB (knex, schemas = null) {
}

export function init (ctx) {
  const { bodyParser, express, sendMail } = ctx
  const forward = Forward(ctx)
  const questions = Questions(ctx)
  const validate = Validate(ctx, questions)
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