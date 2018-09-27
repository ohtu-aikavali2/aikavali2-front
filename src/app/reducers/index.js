import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import uiReducer from './uiReducer'
import authReducer from './authReducer'
import questionReducer from './questionReducer'

const combinedReducers = combineReducers({
  ui: uiReducer,
  loggedUser: authReducer,
  question: questionReducer
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export default store
