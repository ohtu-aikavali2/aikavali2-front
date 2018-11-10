import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/questions'

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
// For tests
const getToken = () => {
  return token
}
// For tests
const reload = () => {
  token = null
}

const getRandomQuestion = async () => {
  const config = {
    headers: { 'Authorization': token }
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/random`, config)
  return response.data
}

const answerQuestion = async (id, answer, time) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${baseUrl}${apiUrl}/answer`, { id, answer, time }, config)
  return response.data
}

const postCompileQuestion = async (correctAnswer, options) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${baseUrl}${apiUrl}/compile`, { correctAnswer, options }, config)

  return response.data
}

const postPrintQuestion = async (value, correctAnswer, options) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${baseUrl}${apiUrl}/print`, { value, correctAnswer, options }, config)

  return response.data
}

const sendReviewForQuestion = async (id, review) => {
  const config = {
    headers: { 'Authorization': token }
  }
  await axios.post(`${baseUrl}${apiUrl}/review`, { questionId: id, review }, config)
}

/* ------------ Flagged questions ------------- */

// Kovakoodattu toistaiseksi

const date = Date.now() - 100000
const flaggedQuestions = [
  {
    kind: 'PrintQuestion',
    item: {
      options: [ 'juu', 'jaa', 'jii', 'joo' ],
      _id: '5be3fb4707cbe10ab7f93f7d',
      value: 'moi',
      __v: 0
    },
    flags: 5,
    recentFlag: date + 2000,
    course: 'Ohjelmoinnin perusteet',
    group: 'Viikko 1'
  },
  {
    kind: 'CompileQuestion',
    item: {
      options: [ '2', '3', 'THIS!', '1' ],
      _id: '5be1e731267a84086c6356d5',
      __v: 0
    },
    flags: 2,
    recentFlag: date + 4000,
    course: 'Tietokantojen perusteet',
    group: 'Viikko 3'
  },
  {
    kind: 'PrintQuestion',
    item: {
      options: [ 'juu', 'jaa', 'jii', 'joo' ],
      _id: '5be3fb4307cbe10ab7f93f7d',
      value: 'Kysymys',
      __v: 0
    },
    flags: 3,
    recentFlag: date + 6000,
    course: 'Ohjelmoinnin perusteet',
    group: 'Viikko 4'
  }
]

const getAllFlaggedQuestions = async () => {
  /*const config = {
    headers: { 'Authorization': token }
  }*/
  return flaggedQuestions
}

export default {
  getRandomQuestion,
  answerQuestion,
  postCompileQuestion,
  postPrintQuestion,
  setToken,
  getToken,
  reload,
  sendReviewForQuestion,
  getAllFlaggedQuestions
}
