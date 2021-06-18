import _ from 'underscore'
const q = [
  { q: 'čtvrtý měsíc v roce je', a: 'duben' },
  { q: 'osmý měsíc v roce je', a: 'srpen' },
  { q: 'šestý den v týdnu', a: 'sobota' },
  { q: 'třicet a dvanáct je', a: '42' }
]

function between (min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

export default {
  getRandom: function () {
    const idx = between(0, q.length - 1)
    return { id: idx, q: q[idx].q }
  },
  validate: function (id, answer) {
    return answer && id >= 0 && id < q.length && answer.toString() === q[id].a
  }
}