import express from 'express'

export default function (port, g) {
  const app = express()
  app.post('/', express.json(), (req, res) => {
    g.apimock.basket.push(req.body)
    res.json(g.apimock.response)
  })
  return app.listen(port)
}