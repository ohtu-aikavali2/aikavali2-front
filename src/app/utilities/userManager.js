import tmcClient from 'tmc-client-js'

const clientId = process.env.REACT_APP_TMC_CLIENT_ID
const tmcSecret = process.env.REACT_APP_TMC_SECRET
const client = new tmcClient(clientId, tmcSecret)

const login = (username, password) => client.authenticate({ username, password })

const logout = () => client.unauthenticate()

const getUser = () => client.getUser()

export default {
  login,
  logout,
  getUser
}
