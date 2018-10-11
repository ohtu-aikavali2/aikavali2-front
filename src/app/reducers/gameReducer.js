import gameConstants from './constants/gameConstants'

const initialState = {
  // started: false,
  ended: false,
  paused: false
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameConstants.INITIALIZE_GAME: {
      return {
        // started: true,
        ended: false,
        paused: false
      }
    }
    case gameConstants.START_GAME: {
      return {
        // started: true,
        ended: false,
        paused: false
      }
    }
    case gameConstants.END_GAME: {
      return {
        // started: false,
        ended: true,
        paused: false
      }
    }
    default: {
      return state
    }
  }
}

export default gameReducer
