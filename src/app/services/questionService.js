import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back2.herokuapp.com'
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

const getConfig = () => {
  return {
    headers: { 'Authorization': token }
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
}

const getQuestions = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}`, getConfig())
  return response.data
}

const getRandomQuestion = async (course) => {
  let params = ''
  if (course) {
    params = `?course=${course}`
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/random${params}`, getConfig())
  return response.data
}

const answerQuestion = async (id, answer, time) => {
  // In case the question has been removed by admin
  try {
    const response = await axios.post(`${baseUrl}${apiUrl}/answer`, { id, answer, time }, getConfig())
    return response.data
  } catch (e) {
    return { error: 'Something went wrong while sending the answer' }
  }
}

const postQuestion = async (question) => {
  const response = await axios.post(`${baseUrl}${apiUrl}`, question, getConfig())
  return response.data
}

const sendReviewForQuestion = async (id, review) => {
  await axios.post(`${baseUrl}/api/v1/reviews`, { questionId: id, review }, getConfig())
}

const deleteQuestions = async (questionIDs) => {
  try {
    // return flaggedQuestions.filter(q => questionIDs.indexOf(q.item._id) === -1)
    await axios.put(`${baseUrl}${apiUrl}/delete`, { questionIDs }, getConfig())
  } catch (e) {
    return { error: 'Could not delete questions' }
  }
}

const unflagQuestions = async (questionIDs) => {
  try {
    await axios.put(`${baseUrl}/api/v1/flags`, { questionIDs }, getConfig())
  } catch (e) {
    return { error: 'Could not unflag the questions' }
  }
}

const flagQuestion = async (questionID) => {
  await axios.post(`${baseUrl}/api/v1/flags`, { questionID }, getConfig())
  // console.log('Lähetetään flägi backille, questionID: ' + questionID)
}

const restoreQuestions = async (questionIDs) => {
  try {
    await axios.put(`${baseUrl}${apiUrl}/restore`, { questionIDs }, getConfig())
  } catch (e) {
    return { error: 'Could not restore the questions' }
  }
}

const getAllFlaggedQuestions = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/flagged`, getConfig())
  return response.data
}

const getDeletedQuestions = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/deleted`, getConfig())
  return response.data
}

const getAvailableQuestions = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/available`, getConfig())
  return response.data
}

export default {
  getQuestions,
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
