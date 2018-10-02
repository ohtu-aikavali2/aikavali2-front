import axios from 'axios'
let token = null

const baseUrl = '/api/v1/user'

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
  const response = await axios.post(`${baseUrl}/generate`, config)
  return response.data
}

export default { generateNewUnregisteredUser, setToken, getToken }
