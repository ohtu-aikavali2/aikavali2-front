import tmcClient, { mockAuthenticate, mockUnAuthenticate, mockGetUser } from 'tmc-client-js'
jest.mock('tmc-client-js')
import userManager from '../../app/utilities/userManager'

describe('userManager', () => {
  beforeEach(() => {
    tmcClient.mockClear()
    mockAuthenticate.mockClear()
  })
  afterAll(() => {
    jest.unmock('tmc-client-js')
  })
  it('login calls tmcClient.authenticate', () => {
    userManager.login()
    expect(mockAuthenticate).toHaveBeenCalledTimes(1)
  })
  it('logout calls tmcClient.unathenticate', () => {
    userManager.logout()
    expect(mockUnAuthenticate).toHaveBeenCalledTimes(1)
  })
  it('getUser calls tmcClient.getUser', () => {
    userManager.getUser()
    expect(mockGetUser).toHaveBeenCalledTimes(1)
  })
})
