import authConstants from '../constants/authConstants'
import authService from '../../services/authService'
import questionService from '../../services/questionService'
import store from 'store-js'

export const loggedUserInitialization = () => {
  return async (dispatch) => {
    let loggedUser = store.get('user')
    if (!loggedUser) {
      loggedUser = await authService.generateNewUnregisteredUser()
      store.set('user', loggedUser)
      // loggedUser will have id. If user is registered, also token and other stuff
    }
    await questionService.setToken(loggedUser.token)
    await authService.setToken(loggedUser.token)
    dispatch({
      type: authConstants.INITIALIZE_USER,
      data: loggedUser
    })
  }
}
export const logout = () => {
  return async (dispatch) => {
    store.remove('user')
    await questionService.setToken(null)
    await authService.setToken(null)
    dispatch({
      type: authConstants.LOGOUT
    })
  }
}
