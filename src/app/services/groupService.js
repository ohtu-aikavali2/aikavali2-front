import axios from 'axios'
let token = null

let baseUrl = ''
// This can not be tested. It's ok tho
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://aikavali-back.herokuapp.com'
}

const apiUrl = '/api/v1/groups'

const createGroup = async (data) => {
  const config = {
    headers: { 'Authorization': token}
  }
  const response = await axios.post(`${baseUrl}${apiUrl}`, data, config)
  return response.data
}

export default {
  createGroup
}