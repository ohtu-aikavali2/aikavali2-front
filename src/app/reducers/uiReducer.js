import uiConstants from './constants/uiConstants'

const initialState = {
  drawerOpen: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case uiConstants.TOGGLE_DRAWER: {
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
