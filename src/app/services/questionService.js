import axios from 'axios'

let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/questions'

const getRandomQuestion = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}/random`)
  return response.data
}

export default { getRandomQuestion }
