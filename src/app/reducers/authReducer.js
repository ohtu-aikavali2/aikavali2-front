import authConstants from './constants/authConstants'

const initialState = {
  loggedUser: null,
  loadingUser: true,
  loggingIn: false,
  error: ''
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authConstants.INITIALIZE_USER: {
      return {
        ...state,
        loggedUser: action.data,
        loadingUser: false
      }
    }
    case authConstants.LOGOUT: {
      return {
        ...state,
        loggedUser: null
      }
    }

    case authConstants.LOGIN: {
      return {
        ...state,
        loggingIn: true,
        error: ''
      }
    }

    case authConstants.LOGIN_SUCCESSFUL: {
      return {
        ...state,
        loggedUser: action.data,
        loggingIn: false,
        error: ''
      }
    }

    case authConstants.LOGIN_FAILURE: {
      return {
        ...state,
        loggingIn: false,
        error: action.data
      }
    }

    default: {
      return state
    }
  }
}

export default authReducer
