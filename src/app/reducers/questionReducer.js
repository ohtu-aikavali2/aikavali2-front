import questionConstants from './constants/questionConstants'

const initialState = {
  question: null
}

const questionReducer = (state = initialState, action) => {
  switch (action.type) {
    case questionConstants.GET_RANDOM_QUESTION: {
      return {
        question: {
          kind: action.data.kind,
          options: action.data.item.options,
          id: action.data.item._id,
          value: !action.data.item.value ? null : action.data.item.value
        }
      }
    }
    default: {
      return state
    }
  }
}

export default questionReducer
