const loggedUser = {
  id: 123,
  token: 12345
}
let tokenSet = false

const generateNewUnregisteredUser = () => {
  return Promise.resolve(loggedUser)
}

const setToken = () => {
  tokenSet = true
}

const tokenIsSet = () => {
  return tokenSet
}

export default { generateNewUnregisteredUser, loggedUser, setToken, tokenIsSet }
