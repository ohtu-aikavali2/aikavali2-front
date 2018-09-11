import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import exampleReducer from './exampleReducer'
import uiReducer from './uiReducer'

const combinedReducers = combineReducers({
  example: exampleReducer,
  ui: uiReducer
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export default store
