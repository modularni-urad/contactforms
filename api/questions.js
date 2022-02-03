import _ from 'underscore'

const q = [
  { q: 'čtvrtý měsíc v roce je', a: 'duben' },
  { q: 'osmý měsíc v roce je', a: 'srpen' },
  { q: 'šestý den v týdnu', a: 'sobota' },
  { q: 'třicet a dvanáct je', a: '42' },
  { q: 'deset a jedna je', a: '11' },
  { q: 'pět a dva je', a: '7' }
]

function getOptions(config) {
  const aditional = _.get(config, 'contactforms.questions')
  return aditional ? _.extend(aditional, q) : q
}

function between (min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

export default {
  getRandom: function (config) {
    const questions = getOptions(config)
    const idx = between(0, questions.length - 1)
    return { id: idx, q: questions[idx].q }
  },
  validate: function (id, answer, config) {
    const questions = getOptions(config)
    return answer && id >= 0 && id < questions.length 
      && answer.toString() === questions[id].a
  }
}