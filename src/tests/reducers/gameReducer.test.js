import gameReducer from '../../app/reducers/gameReducer'
import gameConstants from '../../app/reducers/constants/gameConstants'

describe('gameReducer', () => {
  it('should return initial state', () => {
    expect(gameReducer(undefined, {})).toEqual({
      ended: false,
      paused: false
    })
  })
  it('INITIALIZE_GAME should set ended: false and paused: false', () => {
    expect(gameReducer({ ended: true, paused: true }, {
      type: gameConstants.INITIALIZE_GAME
    })).toEqual({
      ended: false,
      paused: false
    })
  })
  it('START_GAME should set ended: false and paused: false', () => {
    expect(gameReducer({ ended: true, paused: true }, {
      type: gameConstants.START_GAME
    })).toEqual({
      ended: false,
      paused: false
    })
  })
  it('END_GAME should set ended: false and paused: true', () => {
    expect(gameReducer({ ended: true, paused: false }, {
      type: gameConstants.END_GAME
    })).toEqual({
      ended: true,
      paused: false
    })
  })
  it('PAUSE_GAME should set paused: true and hold other fields as they are', () => {
    expect(gameReducer({ paused: false, ended: true }, {
      type: gameConstants.PAUSE_GAME
    })).toEqual({
      paused: true,
      ended: true
    })
  })
})
