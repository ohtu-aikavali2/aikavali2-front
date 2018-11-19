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

const getRandomQuestion = async (course) => {
  const config = {
    headers: { 'Authorization': token }
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
  let params = ''
  if (course) {
    params = `?course=${course}`
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/random${params}`, config)
  return response.data
}

const answerQuestion = async (id, answer, time) => {
  const config = {
    headers: { 'Authorization': token }
  }
  // In case the question has been removed by admin
  try {
    const response = await axios.post(`${baseUrl}${apiUrl}/answer`, { id, answer, time }, config)
    return response.data
  } catch (e) {
    return { error: 'Something went wrong while sending the answer' }
  }
}

const postQuestion = async (question) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${baseUrl}${apiUrl}`, question, config)
  return response.data
}

const sendReviewForQuestion = async (id, review) => {
  const config = {
    headers: { 'Authorization': token }
  }
  await axios.post(`${baseUrl}${apiUrl}/review`, { questionId: id, review }, config)
}

const deleteQuestions = async (questionIDs) => {
  /*const config = {
    headers: { 'Authorization': token }
  }*/
  try {
    return flaggedQuestions.filter(q => questionIDs.indexOf(q.item._id) === -1)
  } catch (e) {
    return { error: 'Could not delete questions' }
  }
}

/* ------------ Flagged questions ------------- */

// Kovakoodattu toistaiseksi

const date = Date.now() - 100000
const flaggedQuestions = [
  {
    kind: 'PrintQuestion',
    item: {
      options: [ 'juu', 'jaa', 'jii', 'joo' ],
      _id: '5be3fb47sdf07cbe10ab7f93f7d',
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
  },
  {
    kind: 'PrintQuestion',
    item: {
      options: [ 'vaihtoehto1', 'vaihtoehto2', 'vaihtoehto3', 'vaihtoehto4' ],
      _id: '5be3fb4307cbe10ab7f9ds3f7d',
      value: 'Kysymys',
      __v: 0
    },
    flags: 4,
    recentFlag: date + 8000,
    course: 'OHJA',
    group: 'Viikko 2'
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
  postQuestion,
  setToken,
  getToken,
  reload,
  sendReviewForQuestion,
  getAllFlaggedQuestions,
  deleteQuestions
}
