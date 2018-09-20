const loggedUser = {
  id: 123,
  token: 12345
}

const generateNewUnregisteredUser = () => {
  return Promise.resolve(loggedUser)
}

export default { generateNewUnregisteredUser, loggedUser }
