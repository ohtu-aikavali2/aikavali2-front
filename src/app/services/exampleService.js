import axios from 'axios'

const baseUrl = '/api/v1/example'

const getExample = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const mockRequest = async () => {
  await new Promise(res => setTimeout(res, 1000))
}

export default {
  mockRequest,
  getExample
}
