import axios from 'axios'

const baseUrl = '/api/v1/user'

const generateNewUnregisteredUser = async () => {
  const response = await axios.post(`${baseUrl}/generate`)
  return response.data
}

export default { generateNewUnregisteredUser }
