import gameReducer from '../../app/reducers/gameReducer'
import gameConstants from '../../app/reducers/constants/gameConstants'

describe('gameReducer', () => {
  it('should return initial state', () => {
    expect(gameReducer(undefined, {})).toEqual({
      started: false,
      ended: false
    })
  })
  it('INITIALIZE_GAME should set started: false and ended: false', () => {
    expect(gameReducer({ started: true, ended: true }, {
      type: gameConstants.INITIALIZE_GAME
    })).toEqual({
      started: false,
      ended: false
    })
  })
  it('START_GAME should set started: true and ended: false', () => {
    expect(gameReducer({ started: false, ended: true }, {
      type: gameConstants.START_GAME
    })).toEqual({
      started: true,
      ended: false
    })
  })
  it('END_GAME should set started: false and ended: true', () => {
    expect(gameReducer({ started: true, ended: false }, {
      type: gameConstants.END_GAME
    })).toEqual({
      started: false,
      ended: true
    })
  })
})