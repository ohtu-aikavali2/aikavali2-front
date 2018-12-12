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
  }
  const response = await axios.get(`${baseUrl}${apiUrl}`, config)
  return response.data
}

const getCourse = async (name) => {
  const config = {
    headers: { 'Authorization': token}
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/${name}`, config)
  return response.data
}

const createCourse = async (data) => {
  const config = {
    headers: { 'Authorization': token}
  }
  const response = await axios.post(`${baseUrl}${apiUrl}`, data, config)
  return response.data
}

const updateCourse = async (data, id) => {
  const config = {
    headers: { 'Authorization': token}
  }
  const response = await axios.patch(`${baseUrl}${apiUrl}/${id}`, data, config)
  return response.data
}

export default {
  getCourses,
  getCourse,
  createCourse,
  updateCourse
}
