import gameConstants from '../constants/gameConstants'

export const initializeGame = () => {
  return async (dispatch) => {
    dispatch({
      type: gameConstants.INITIALIZE_GAME
    })
  }
}

export const startGame = () => {
  return async (dispatch) => {
    dispatch({
      type: gameConstants.START_GAME
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
