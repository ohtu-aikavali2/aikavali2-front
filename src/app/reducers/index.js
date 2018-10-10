import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import uiReducer from './uiReducer'
import authReducer from './authReducer'
import questionReducer from './questionReducer'
import gameReducer from './gameReducer'

const combinedReducers = combineReducers({
  ui: uiReducer,
  loggedUser: authReducer,
  question: questionReducer,
  game: gameReducer
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export default store
