import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/courses'

const getCourses = async () => {
  const config = {
    headers: { 'Authorization': token}
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}`, config)
  return response.data
}

const getCourse = async (name) => {
  const config = {
    headers: { 'Authorization': token}
    // USED FOR DEV PURPOSES
    // params: { force: true }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/${name}`, config)
  return response.data
}

export default {
  getCourses,
  getCourse
}
