import axios from 'axios'
let token = null

let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/questions'

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getRandomQuestion = async () => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.get(`${baseUrl}${apiUrl}/random`, config)
  return response.data
}

export default { getRandomQuestion, setToken }
