import * as actions from '../../../app/reducers/actions/authActions'
import localStore from 'store-js'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('../../../app/services/authService')
import authService from '../../../app/services/authService'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('authActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({ loggedUser: null })
  })
  it('loggedUserInitialization returns user with id and token when store does not have user and sets that user to store', () => {
    localStore.remove('user')
    return reduxStore.dispatch(actions.loggedUserInitialization()).then(() => {
      // return of async actions
      const store = reduxStore.getActions()[0].data
      expect(store.id).toBe(authService.loggedUser.id)
      expect(store.token).toBe(authService.loggedUser.token)
      // Sets user to store
      expect(localStore.get('user').id).toEqual(store.id)
      expect(localStore.get('user').token).toEqual(store.token)
    })
  })
  it('if there is a user in store, loggedUserInitialization returns that user', () => {
    const user = {
      id: 1337,
      token: 13379
    }
    localStore.set('user', user)
    return reduxStore.dispatch(actions.loggedUserInitialization()).then(() => {
      const store = reduxStore.getActions()[0].data
      expect(store.id).toBe(user.id)
      expect(store.token).toBe(user.token)
    })
  })
  it('logout removes user from store and dispatches LOGOUT', () => {
    localStore.set('user', {
      id: 1337,
      token: 13379
    })
    return reduxStore.dispatch(actions.logout()).then(() => {
      const storeActions = reduxStore.getActions()
      let containsLogout = false
      storeActions.forEach(action => {
        if (action.type === 'Logout') {
          containsLogout = true
        }
      })
      expect(containsLogout).toBe(true)
      expect(localStore.get('user')).toBe(undefined)
    })
  })
})