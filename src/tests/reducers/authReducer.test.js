import authReducer from '../../app/reducers/authReducer'
import authConstants from '../../app/reducers/constants/authConstants'

const INITIAL_STATE = {
  loggedUser: null,
  loadingUser: true,
  loggingIn: false,
  error: ''
}
const user = {
  id: 123,
  token: 1234
}
describe('authReducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, {})).toEqual({
      loggedUser: null,
      loadingUser: true,
      loggingIn: false,
      error: ''
    })
  })
  it('INITIALIZE_USER should set loadingUser: false and set loggedUser from parameter', () => {
    const returnedUser = authReducer({ ...INITIAL_STATE, loadingUser: true }, {
      type: authConstants.INITIALIZE_USER,
      data: user
    })
    expect(returnedUser).toEqual({
      ...INITIAL_STATE,
      loadingUser: false,
      loggedUser: user
    })
  })
  it('LOGOUT should set loggedUser: null and hold other fields', () => {
    expect(authReducer({ ...INITIAL_STATE, loggedUser: user }, {
      type: authConstants.LOGOUT
    })).toEqual({
      ...INITIAL_STATE,
      loggedUser: null
    })
  })
  it('LOGIN should set loggingIn: true and error to empty string and hold other fields', () => {
    expect(authReducer({ ...INITIAL_STATE, error: 'to be removed' }, {
      type: authConstants.LOGIN
    })).toEqual({
      ...INITIAL_STATE,
      loggingIn: true,
      error: ''
    })
  })
  it('LOGIN_SUCCESSFUL should set loggingIn: false, error: \'\' and set loggedUser from param', () => {
    expect(authReducer({ ...INITIAL_STATE, loggingIn: true, error: 'to be removed' }, {
      type: authConstants.LOGIN_SUCCESSFUL,
      data: user
    })).toEqual({
      ...INITIAL_STATE,
      loggingIn: false,
      error: '',
      loggedUser: user
    })
  })
  it('LOGIN_FAILURE should set loggingIn: false and error: param', () => {
    expect(authReducer({ ...INITIAL_STATE, loggingIn: true }, {
      type: authConstants.LOGIN_FAILURE,
      data: 'error on the way'
    })).toEqual({
      ...INITIAL_STATE,
      loggingIn: false,
      error: 'error on the way'
    })
  })
})
