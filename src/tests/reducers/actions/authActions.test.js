import * as actions from '../../../app/reducers/actions/authActions'
import localStore from 'store-js'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import authConstants from '../../../app/reducers/constants/authConstants'
jest.mock('../../../app/services/authService')
jest.mock('../../../app/services/questionService')
jest.mock('../../../app/utilities/userManager')
import authService from '../../../app/services/authService'
import questionService from '../../../app/services/questionService'
import userManager from '../../../app/utilities/userManager'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('authActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({ loggedUser: null })
  })
  afterAll(() => {
    jest.unmock('../../../app/services/authService')
    jest.unmock('../../../app/services/questionService')
    jest.unmock('../../../app/utilities/userManager')
  })
  describe('loggedUserInitialization', () => {
    it('if there is a user in store, dispatches INITIALIZE_USER, returns that user and sets token fron authService and questionService', () => {
      const user = {
        id: 1337,
        token: 13379
      }
      localStore.set('user', user)
      return reduxStore.dispatch(actions.loggedUserInitialization()).then(() => {
        expect(reduxStore.getActions()[0].type).toBe(authConstants.INITIALIZE_USER)
        expect(authService.setToken).toHaveBeenCalledTimes(1)
        expect(questionService.setToken).toHaveBeenCalledTimes(1)
        const store = reduxStore.getActions()[0].data
        expect(store.id).toBe(user.id)
        expect(store.token).toBe(user.token)
        authService.setToken.mockClear()
        questionService.setToken.mockClear()
      })
    })
    it('if there is no user in store, loggedUserInitialization dispatches INITIALIZE_USER and returns null and does not set tokens fron authService and questionService', () => {
      localStore.remove('user')
      return reduxStore.dispatch(actions.loggedUserInitialization()).then(() => {
        expect(authService.setToken).toHaveBeenCalledTimes(0)
        expect(questionService.setToken).toHaveBeenCalledTimes(0)
        expect(reduxStore.getActions()[0].type).toBe(authConstants.INITIALIZE_USER)
        const store = reduxStore.getActions()[0].data
        expect(store).toBe(null)
        authService.setToken.mockClear()
        questionService.setToken.mockClear()
      })
    })
  })
  describe('login', () => {
    it('if authService.login responds with error', () => {
      return reduxStore.dispatch(actions.login()).then(() => {
        const storeActions = reduxStore.getActions()
        let containsLogin = false
        let containsLoginFailure = false
        let containsLoginSuccess = false
        storeActions.forEach(action => {
          if (action.type === authConstants.LOGIN) {
            containsLogin = true
          } else if (action.type === authConstants.LOGIN_FAILURE) {
            containsLoginFailure = true
          } else if (action.type === authConstants.LOGIN_SUCCESSFUL) {
            containsLoginSuccess = true
          }
        })
        expect(containsLogin).toBe(true)
        expect(containsLoginFailure).toBe(true)
        expect(containsLoginSuccess).toBe(false)
        expect(authService.setToken).toHaveBeenCalledTimes(0)
        expect(questionService.setToken).toHaveBeenCalledTimes(0)
        authService.setToken.mockClear()
        questionService.setToken.mockClear()
      })
    })
    it('if authService.login is successful', () => {
      return reduxStore.dispatch(actions.login('username', 'password')).then(() => {
        const storeActions = reduxStore.getActions()
        let containsLogin = false
        let containsLoginFailure = false
        let containsLoginSuccess = false
        storeActions.forEach(action => {
          if (action.type === authConstants.LOGIN) {
            containsLogin = true
          } else if (action.type === authConstants.LOGIN_FAILURE) {
            containsLoginFailure = true
          } else if (action.type === authConstants.LOGIN_SUCCESSFUL) {
            containsLoginSuccess = true
            expect(action.data).toEqual(authService.getLoggedUser())
          }
        })
        expect(containsLogin).toBe(true)
        expect(containsLoginFailure).toBe(false)
        expect(containsLoginSuccess).toBe(true)
        expect(authService.setToken).toHaveBeenCalledTimes(1)
        expect(questionService.setToken).toHaveBeenCalledTimes(1)
        expect(localStore.get('user')).toEqual(authService.getLoggedUser())
        authService.setToken.mockClear()
        questionService.setToken.mockClear()
      })
    })
  })
  it('logout removes user from store and dispatches LOGOUT and sets token: null for authService and questionService', () => {
    localStore.set('user', {
      id: 1337,
      token: 13379
    })
    return reduxStore.dispatch(actions.logout()).then(() => {
      const storeActions = reduxStore.getActions()
      let containsLogout = false
      expect(authService.setToken).toHaveBeenCalledTimes(1)
      expect(questionService.setToken).toHaveBeenCalledTimes(1)
      storeActions.forEach(action => {
        if (action.type === 'Logout') {
          containsLogout = true
        }
      })
      expect(containsLogout).toBe(true)
      expect(localStore.get('user')).toBe(undefined)
      expect(userManager.logout).toHaveBeenCalledTimes(1)
      authService.setToken.mockClear()
      questionService.setToken.mockClear()
      userManager.logout.mockClear()
    })
  })
})
/*
export const logout = () => {
  return async (dispatch) => {
    userManager.logout()
    store.remove('user')
    await questionService.setToken(null)
    await authService.setToken(null)
    dispatch({
      type: authConstants.LOGOUT
    })
  }
}
*/
