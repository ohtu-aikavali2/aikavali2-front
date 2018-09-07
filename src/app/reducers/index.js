import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import exampleReducer from './exampleReducer'

const combinedReducers = combineReducers({
  example: exampleReducer
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export default store
