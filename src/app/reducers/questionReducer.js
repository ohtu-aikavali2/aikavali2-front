import questionConstants from './constants/questionConstants'

const initialState = {
  question: null,
  userAnswer: null,
  selectedAnswer: null
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        ...state,
        question: action.data,
        userAnswer: null,
        selectedAnswer: null
      }
    }

    case questionConstants.QUESTION_ANSWERED: {
      return {
        ...state,
        userAnswer: action.data
      }
    }

    case questionConstants.SELECT_ANSWER: {
      return {
        ...state,
        // only contains object { id, value }
        selectedAnswer: action.data
      }
    }

    default: {
      return state
    }
  }
}

export default questionReducer
