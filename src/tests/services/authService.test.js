// import mockAxios from 'axios'
jest.unmock('../../app/services/authService')
import authService from '../../app/services/authService'

describe('authService', () => {
  /* describe('generateNewUnregisteredUser', () => {
    let newUser
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            id: 123,
            token: 567
          }
        })
      )
    })
    it('calls axios post', async () => {
      newUser = await authService.generateNewUnregisteredUser()
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
    })
    describe('calls axios post with /api/v1/user/generate and configs', () => {
      it('when token is not set', async () => {
        newUser = await authService.generateNewUnregisteredUser()
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/user/generate',
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        authService.setToken(1337)
        newUser = await authService.generateNewUnregisteredUser()
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/user/generate',
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
    it('returns user object from axios', async () => {
      newUser = await authService.generateNewUnregisteredUser()
      expect(newUser).toEqual({
        id: 123,
        token: 567
      })
    })
  })*/
  it ('sets token', () => {
    authService.setToken(8783)
    expect(authService.getToken()).toBe('bearer 8783')
  })
})
/*
const login = async (username, password) => {
  try {
    await userManager.login(username, password)
    const response = await axios.post(`${baseUrl}${apiUrl}/login`, { user: userManager.getUser() })
    return response.data
  } catch (e) {
    return { error: 'Väärä käyttäjätunnus tai salasana!' }
  }
}
*/
