import authConstants from '../constants/authConstants'
import authService from '../../services/authService'
import questionService from '../../services/questionService'
import courseService from '../../services/courseService'
import groupService from '../../services/groupService'
import userManager from '../../utilities/userManager'
import store from 'store-js'
import conceptService from '../../services/conceptService'

export const loggedUserInitialization = () => {
  return async (dispatch) => {
    let loggedUser = store.get('user')
    if (!loggedUser) {
      loggedUser = null
    } else {
      await questionService.setToken(loggedUser.token)
      await authService.setToken(loggedUser.token)
      await courseService.setToken(loggedUser.token)
      await conceptService.setToken(loggedUser.token)
    }
    dispatch({
      type: authConstants.INITIALIZE_USER,
      data: loggedUser
    })
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN })
    const response = await authService.login(username, password)
    if (response.error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        data: response.error
      })
      return
    }
    await questionService.setToken(response.token)
    await authService.setToken(response.token)
    await courseService.setToken(response.token)
    await groupService.setToken(response.token)
    await conceptService.setToken(response.token)
    dispatch({
      type: authConstants.LOGIN_SUCCESSFUL,
      data: { ...response }
    })
    store.set('user', { ...response })
  }
}

export const logout = () => {
  return async (dispatch) => {
    userManager.logout()
    store.remove('user')
    await questionService.setToken(null)
    await authService.setToken(null)
    await courseService.setToken(null)
    await groupService.setToken(null)
    await conceptService.setToken(null)
    dispatch({
      type: authConstants.LOGOUT
    })
  }
}

export const setHasSeenIntro = (value) => {
  return async (dispatch) => {
    let loggedUser = store.get('user')
    await authService.setHasSeenIntro(value)
    loggedUser.hasSeenIntro = value
    dispatch({
      type: authConstants.INITIALIZE_USER,
      data: loggedUser
    })
    store.set('user', loggedUser)
  }
}
