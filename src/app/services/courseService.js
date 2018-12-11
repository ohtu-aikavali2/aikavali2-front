import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/courses'

const setToken = (newToken) => {
  token = `bearer ${newToken}`
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

const getCourse = async (name) => {
  const response = await axios.get(`${baseUrl}${apiUrl}/${name}`, getConfig())
  return response.data
}

export default {
  getCourses,
  getCourse,
  setToken
}
