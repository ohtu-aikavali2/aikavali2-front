import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back2.herokuapp.com'
}

const apiUrl = '/api/v1/courses'

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// For tests
const getToken = () => {
  return token
}

const getConfig = () => {
  return {
    headers: { 'Authorization': token }
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
}

const getCourses = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}`, getConfig())
  return response.data
}

const getCourse = async (id) => {
  const response = await axios.get(`${baseUrl}${apiUrl}/${id}`, getConfig())
  return response.data
}

const createCourse = async (data) => {
  const response = await axios.post(`${baseUrl}${apiUrl}`, data, getConfig())
  return response.data
}

const updateCourse = async (data, id) => {
  const response = await axios.patch(`${baseUrl}${apiUrl}/${id}`, data, getConfig())
  return response.data
}

export default {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  setToken,
  getToken
}
