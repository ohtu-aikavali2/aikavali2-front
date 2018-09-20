import axios from 'axios'

const baseUrl = '/api/v1/questions'

const getRandomQuestion = async () => {
  const response = await axios.get(`${baseUrl}/random`)
  return response.data
}

export default { getRandomQuestion }
