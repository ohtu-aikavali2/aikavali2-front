import axios from 'axios'
let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/user'
let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

// For tests
const getToken = () => {
  return token
}

const generateNewUnregisteredUser = async () => {
  // No need for config here. Just here to get lint through
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(`${baseUrl}${apiUrl}/generate`, config)
  return response.data
}

export default { generateNewUnregisteredUser, setToken, getToken }
