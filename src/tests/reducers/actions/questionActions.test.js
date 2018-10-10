import * as actions from '../../../app/reducers/actions/questionActions'
// import localStore from 'store-js'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('../../../app/services/questionService')
import questionService from '../../../app/services/questionService'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('questionActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({ question: null, answer: null })
  })
  it('getRandomQuestion returns a random question', () => {
    return reduxStore.dispatch(actions.getRandomQuestion()).then(() => {
      // return of async actions
      const store = reduxStore.getActions()[0].data
      expect(store.kind).toBe(questionService.question.kind)
      // toEqual, because options are shuffled
      expect(store.item).toEqual(questionService.question.item)
      expect(store._id).toBe(questionService.question._id)
      expect(store.__v).toBe(questionService.question.__v)
    })
  })
  it('answerQuestion dispatches an answer object', () => {
    return reduxStore.dispatch(actions.answerQuestion()).then(() => {
      // return of async actions
      const store = reduxStore.getActions()[0].data
      expect(store.isCorrect).toBe(questionService.answer.isCorrect)
      expect(store.correctAnswer).toEqual(questionService.answer.correctAnswer)
    })
  })
})
