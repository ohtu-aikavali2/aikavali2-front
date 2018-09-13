import authConstants from './constants/authConstants'

const initialState = {
  loggedUser: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authConstants.INITIALIZE_USER: {
      return {
        loggedUser: action.data
      }
    }
    case authConstants.LOGOUT: {
      return {
        ...state,
        loggedUser: null
      }
    }
    default: {
      return state
    }
  }
}

export default authReducer
