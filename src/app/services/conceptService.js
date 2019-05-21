import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/concepts'

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

const getConcepts = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}`, getConfig())
  return response.data
}

const postConcept = async (concept) => {
  const response = await axios.post(`${baseUrl}${apiUrl}`, concept, getConfig())
  return response.data
}

const deleteConcepts = async (conceptIDs) => {
  try {
    await axios.put(`${baseUrl}${apiUrl}/delete`, { conceptIDs }, getConfig())
  } catch (e) {
    return { error: 'Could not delete concepts' }
  }
}

const restoreConcepts = async (conceptIDs) => {
  try {
    await axios.put(`${baseUrl}${apiUrl}/restore`, { conceptIDs }, getConfig())
  } catch (e) {
    return { error: 'Could not restore the concepts' }
  }
}

const getDeletedConcepts = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/deleted`, getConfig())
  return response.data
}

const getAvailableQuestions = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/available`, getConfig())
  return response.data
}

export default {
  getConcepts,
  postConcept,
  setToken,
  getToken,
  reload,
  deleteConcepts,
  getDeletedConcepts,
  restoreConcepts,
  getAvailableQuestions
}
