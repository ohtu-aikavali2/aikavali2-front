import questionConstants from './constants/questionConstants'

const initialState = {
  question: null,
  userAnswer: null
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        ...state,
        question: action.data,
        userAnswer: null
      }
    }

    case questionConstants.QUESTION_ANSWERED: {
      return {
        ...state,
        question: null,
        userAnswer: action.data
      }
    }

    default: {
      return state
    }
  }
}

export default questionReducer
