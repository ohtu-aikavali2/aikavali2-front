
const question = {
  kind: 'CompileQuestion',
  item: {
    options: [
      'if i > 1',
      '(if) i > 1',
      '(if i > 1)',
      'if (i > 1) {}'
    ]
  },
  _id: '5ba9d7b57cb50d03b2e4a9e3',
  __v: 0
}
let tokenSet = false

const getRandomQuestion = async () => {
  return question
}

const setToken = () => {
  tokenSet = true
}

const tokenIsSet = () => {
  return tokenSet
}

const answer = {
  isCorrect: false,
  correctAnswer: 'Oikea vastaus'
}

const answerQuestion = async () => {
  return answer
}

export default { getRandomQuestion, answerQuestion, setToken, tokenIsSet, question, answer }
