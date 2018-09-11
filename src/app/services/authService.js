// import axios from 'axios'

// const baseUrl = '/api/login'

const generateNewUnregisteredUser = async () => {
  // const response = await axios.post(baseUrl)
  const response = {
    data: {
      id: Math.floor(Math.random() * 1000),
      token: null
    }
  }
  return response.data
}

export default { generateNewUnregisteredUser }
