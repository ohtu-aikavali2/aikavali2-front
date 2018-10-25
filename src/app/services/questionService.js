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
    headers: { 'Authorization': token}
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

export default { getRandomQuestion, answerQuestion, postCompileQuestion, postPrintQuestion, setToken, getToken, reload }
