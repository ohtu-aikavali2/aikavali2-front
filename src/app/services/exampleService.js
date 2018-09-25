import axios from 'axios'
let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/example'

const getExample = async () => {
  const response = await axios.get(`${baseUrl}${apiUrl}`)
  return response.data
}

const mockRequest = async () => {
  await new Promise(res => setTimeout(res, 1000))
}

export default {
  mockRequest,
  getExample
}
