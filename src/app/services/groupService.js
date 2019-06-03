import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back2.herokuapp.com'
}

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

const apiUrl = '/api/v1/groups'

const createGroup = async (data) => {
  const response = await axios.post(`${baseUrl}${apiUrl}`, data, getConfig())
  return response.data
}

export default {
  createGroup,
  setToken
}