const loggedUser = {
  id: 123,
  token: 12345
}

const login = (username, password) => {
  if (!username || !password) {
    return Promise.resolve({ error: 'error' })
  }
  return Promise.resolve(loggedUser)
}

const getLoggedUser = () => {
  return loggedUser
}

export default {
  loggedUser,
  setToken: jest.fn(),
  login,
  getLoggedUser,
  setHasSeenIntro: jest.fn()
}
