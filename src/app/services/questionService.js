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

const getRandomQuestion = async () => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/random`, config)
  return response.data
}

export default { getRandomQuestion, setToken, getToken }
