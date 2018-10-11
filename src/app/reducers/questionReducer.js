import questionConstants from './constants/questionConstants'

const initialState = {
  question: null,
  userAnswer: null,
  message: null
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        ...state,
        question: action.data,
        userAnswer: null,
        message: null
      }
    }

    case questionConstants.QUESTION_ANSWERED: {
      return {
        ...state,
        userAnswer: action.data
      }
    }

    case questionConstants.ADD_MESSAGE_FROM_BACKEND: {
      return {
        ...state,
        // Just remove the question when message is applied from backend
        question: null,
        userAnswer: null,
        message: action.data
      }
    }

    default: {
      return state
    }
  }
}

export default questionReducer
