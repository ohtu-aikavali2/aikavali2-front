import exampleConstants from './constants/exampleConstants'

const initialState = {
  currentValue: 0,
  example: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case exampleConstants.EXAMPLE_INCREMENT: {
      return {
        ...state,
        currentValue: action.payload
      }
    }
    case exampleConstants.GET_EXAMPLE: {
      return {
        ...state,
        example: action.data
      }
    }
    default: {
      return state
    }
  }
}

export default reducer
