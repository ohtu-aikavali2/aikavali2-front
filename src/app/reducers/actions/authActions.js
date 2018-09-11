import authConstants from '../constants/authConstants'
import authService from '../../services/authService'
import store from 'store-js'

export const loggedUserInitialization = () => {
  return async (dispatch) => {
    let loggedUser = store.get('user')
    if (!loggedUser) {
      loggedUser = await authService.generateNewUnregisteredUser()
      store.set('user', loggedUser)
      // loggedUser will have id. If user is registered, also token and other stuff
    }
    dispatch({
      type: authConstants.INITIALIZE_USER,
      data: loggedUser
    })
  }
}
export const logout = () => {
  return async (dispatch) => {
    store.remove('user')
    dispatch({
      type: authConstants.LOGOUT
    })
  }
}
