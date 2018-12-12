import * as actions from '../../../app/reducers/actions/gameActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import gameConstant from '../../../app/reducers/constants/gameConstants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('gameActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({ started: false, ended: false })
  })
  it('initializeGame dispatches INITIALIZE_GAME', () => {
    return reduxStore.dispatch(actions.initializeGame()).then(() => {
      // return of async actions
      expect(reduxStore.getActions()[0].type).toEqual(gameConstant.INITIALIZE_GAME)
    })
  })
  it('endGame dispatches END_GAME', () => {
    return reduxStore.dispatch(actions.endGame()).then(() => {
      expect(reduxStore.getActions()[0].type).toEqual(gameConstant.END_GAME)
    })
  })
  it('pauseGame dispatches PAUSE_GAME', () => {
    return reduxStore.dispatch(actions.pauseGame()).then(() => {
      expect(reduxStore.getActions()[0].type).toEqual(gameConstant.PAUSE_GAME)
    })
  })
})
