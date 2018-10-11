import gameConstants from './constants/gameConstants'

const initialState = {
  ended: false,
  paused: false
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case gameConstants.INITIALIZE_GAME: {
      return {
        ended: false,
        paused: false
      }
    }
    case gameConstants.START_GAME: {
      return {
        ended: false,
        paused: false
      }
    }
    case gameConstants.END_GAME: {
      return {
        ended: true,
        paused: false
      }
    }
    case gameConstants.PAUSE_GAME: {
      return {
        ...state,
        paused: true
      }
    }
    default: {
      return state
    }
  }
}

export default gameReducer
