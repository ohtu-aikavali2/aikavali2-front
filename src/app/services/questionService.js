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
  await axios.post(`${baseUrl}/api/v1/reviews`, { questionId: id, review }, config)
}

const deleteQuestions = async (questionIDs) => {
  const config = {
    headers: { 'Authorization': token }
  }
  try {
    // return flaggedQuestions.filter(q => questionIDs.indexOf(q.item._id) === -1)
    await axios.put(`${baseUrl}${apiUrl}/delete`, { questionIDs }, config)
  } catch (e) {
    return { error: 'Could not delete questions' }
  }
}

const unflagQuestions = async (questionIDs) => {
  const config = {
    headers: { 'Authorization': token }
  }
  try {
    await axios.put(`${baseUrl}/api/v1/flags`, { questionIDs }, config)
  } catch (e) {
    return { error: 'Could not unflag the questions' }
  }
}

const flagQuestion = async (questionID) => {
  const config = {
    headers: { 'Authorization': token }
  }
  await axios.post(`${baseUrl}/api/v1/flags`, { questionID }, config)
  // console.log('Lähetetään flägi backille, questionID: ' + questionID)
}

const restoreQuestions = async (questionIDs) => {
  const config = {
    headers: { 'Authorization': token }
  }
  try {
    await axios.put(`${baseUrl}${apiUrl}/restore`, { questionIDs }, config)
  } catch (e) {
    return { error: 'Could not restore the questions' }
  }
}

const getAllFlaggedQuestions = async () => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/flagged`, config)
  return response.data
}

const getDeletedQuestions = async () => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/deleted`, config)
  return response.data
}

const getAvailableQuestions = async () => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/available`, config)
  return response.data
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
  deleteQuestions,
  unflagQuestions,
  flagQuestion,
  getDeletedQuestions,
  restoreQuestions,
  getAvailableQuestions
}
