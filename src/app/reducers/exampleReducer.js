import exampleConstants from './constants/exampleConstants'

const initialState = {
  currentValue: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case exampleConstants.EXAMPLE_INCREMENT: {
      return {
        ...state,
        currentValue: action.payload
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
