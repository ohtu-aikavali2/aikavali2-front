import gameConstants from './constants/gameConstants'

const initialState = {
  started: false,
  ended: false
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameConstants.INITIALIZE_GAME: {
      return {
        started: false,
        ended: false
      }
    }
    case gameConstants.START_GAME: {
      return {
        started: true,
        ended: false
      }
    }
    case gameConstants.END_GAME: {
      return {
        started: false,
        ended: true
      }
    }
    default: {
      return state
    }
  }
}

export default gameReducer
