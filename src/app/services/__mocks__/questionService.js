
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

const getRandomQuestion = async () => {
  return question
}

/*const answer = {
  isCorrect: false,
  correctAnswer: 'Oikea vastaus'
}

const answerQuestion = async () => {
  return answer
}*/

export default {
  getRandomQuestion,
  answerQuestion: jest.fn(),
  setToken: jest.fn(),
  question,
  postQuestion: jest.fn(),
  sendReviewForQuestion: jest.fn(),
  deleteQuestions: jest.fn(),
  unflagQuestions: jest.fn(),
  flagQuestion: jest.fn(),
  getDeletedQuestions: jest.fn(),
  restoreQuestions: jest.fn(),
  getAvailableQuestions: jest.fn(),
  getAllFlaggedQuestions: jest.fn()
}
