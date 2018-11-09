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
    headers: { 'Authorization': token}
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
  const response = await axios.post(`${baseUrl}${apiUrl}/answer`, { id, answer, time }, config)
  return response.data
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
  await axios.post(`${baseUrl}${apiUrl}/review`, { questionId:id, review }, config)
}

export default {
  getRandomQuestion,
  answerQuestion,
  postQuestion,
  setToken,
  getToken,
  reload,
  sendReviewForQuestion
}
