import authReducer from '../../app/reducers/authReducer'
import authConstants from '../../app/reducers/constants/authConstants'

describe('authReducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, {})).toEqual({
      loggedUser: null
    })
  })
  it('should handle INITIALIZE_USER', () => {
    const returnedUser = authReducer(undefined, {
      type: authConstants.INITIALIZE_USER,
      data: {
        id: 123,
        token: 1234
      }
    })
    expect(returnedUser.loggedUser.id).toBe(123)
    expect(returnedUser.loggedUser.token).toBe(1234)
  })
  it('should handle LOGOUT', () => {
    const returnedUser = authReducer(
      {
        loggedUser: {
          id: 123,
          token: 1234
        },
        randomState: 45
      },
      {
        type: authConstants.LOGOUT
      }
    )
    expect(returnedUser.loggedUser).toBe(null)
    expect(returnedUser.randomState).toBe(45)
  })
})
