import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import exampleReducer from './exampleReducer'
import uiReducer from './uiReducer'
import authReducer from './authReducer'

const combinedReducers = combineReducers({
  example: exampleReducer,
  ui: uiReducer,
  loggedUser: authReducer
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export default store
