import gameConstants from '../constants/gameConstants'

export const initializeGame = () => {
  return async (dispatch) => {
    dispatch({
      type: gameConstants.INITIALIZE_GAME
    })
  }
}

export const endGame = () => {
  return async (dispatch) => {
    dispatch({
      type: gameConstants.END_GAME
    })
  }
}

export const pauseGame = () => {
  return async (dispatch) => {
    dispatch({
      type: gameConstants.PAUSE_GAME
    })
  }
}
