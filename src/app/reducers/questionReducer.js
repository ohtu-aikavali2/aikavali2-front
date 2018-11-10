import questionConstants from './constants/questionConstants'

const initialState = {
  question: null,
  loading: false,
  answering: false,
  userAnswer: null,
  message: null,
  flaggedQuestions: []
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        ...state,
        question: action.data,
        loading: false,
        message: null,
        userAnswer: null
      }
    }

    case questionConstants.FETCHING_QUESTION: {
      return {
        ...state,
        loading: true,
        question: null,
        userAnswer: null
      }
    }

    case questionConstants.ANSWER_QUESTION: {
      return {
        ...state,
        answering: true
      }
    }

    case questionConstants.QUESTION_ANSWERED: {
      return {
        ...state,
        userAnswer: action.data,
        answering: false
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

    case questionConstants.GET_ALL_FLAGGED_QUESTIONS: {
      return {
        ...state,
        flaggedQuestions: action.data
      }
    }

    default: {
      return state
    }
  }
}

export default questionReducer
