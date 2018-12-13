import mockAxios from 'axios'
jest.unmock('../../app/services/authService')
import authService from '../../app/services/authService'
jest.mock('../../app/utilities/userManager')
import userManager from '../../app/utilities/userManager'

describe('authService', () => {
  afterAll(() => {
    jest.unmock('../../app/utilities/userManager')
  })
  it('login calls userManager.login and returns user when no errors', async () => {
    mockAxios.post.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          id: 123,
          token: 567
        }
      })
    )
    userManager.getUser.mockReturnValueOnce({ name: 'Paavo' })
    let response = await authService.login('username', 'password')
    expect(userManager.login).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledTimes(1)
    expect(userManager.getUser).toHaveBeenCalledTimes(1)
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/v1/user/login',
      {
        user: { name: 'Paavo' }
      }
    )
    expect(response).toEqual({
      id: 123,
      token: 567
    })
  })
  it('login returns handles error when there is an error with axios post', async () => {
    mockAxios.post.mockImplementationOnce(() => { throw new Error('error') })
    let response = await authService.login('username', 'password')
    expect(response).toEqual({ error: 'Väärä käyttäjätunnus tai salasana!' })
  })
  it ('sets token', () => {
    authService.setToken(8783)
    expect(authService.getToken()).toBe('bearer 8783')
  })
  describe('setHasSeenIntro', () => {
    it('calls axios PATCH with correct params and returns data when successful', async () => {
      authService.setToken(8783)
      mockAxios.patch.mockReturnValueOnce({ data: 'dataFromBackend' })
      let response = await authService.setHasSeenIntro(true)
      expect(mockAxios.patch).toHaveBeenCalledWith(
        '/api/v1/user/hasSeenIntro',
        {
          hasSeenIntro: true
        },
        {
          headers: {
            'Authorization': 'bearer 8783'
          }
        }
      )
      expect(response).toEqual('dataFromBackend')
    })
    it('calls axios PATCH and returns error when there is an error with axios patch', async () => {
      mockAxios.patch.mockImplementationOnce(() => { throw new Error('error') })
      let response = await authService.setHasSeenIntro(true)
      expect(response).toEqual({ error: 'Virhe' })
    })
  })
})
