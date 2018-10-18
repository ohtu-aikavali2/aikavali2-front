export const mockAuthenticate = jest.fn()
export const mockUnAuthenticate = jest.fn()
export const mockGetUser = jest.fn()

const mock = jest.fn().mockImplementation(() => {
  return {
    authenticate: mockAuthenticate,
    unauthenticate: mockUnAuthenticate,
    getUser: mockGetUser
  }
})

export default mock
