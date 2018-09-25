import questionConstants from './constants/questionConstants'

const initialState = {
  question: null
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        ...state,
        question: action.data
      }
    }
    default: {
      return state
    }
  }
}

export default questionReducer
