const user = {
  id: 123,
  token: null
}

const generateNewUnregisteredUser = () => {
  return Promise.resolve(user)
}

export default { generateNewUnregisteredUser, user }
