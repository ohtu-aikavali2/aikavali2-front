import * as actions from '../../../app/reducers/actions/questionActions'
// import localStore from 'store-js'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('../../../app/services/questionService')
import questionService from '../../../app/services/questionService'
import questionConstant from '../../../app/reducers/constants/questionConstants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('questionActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({ question: null, answer: null })
  })
  afterAll(() => {
    jest.unmock('../../../app/services/questionService')
  })
  it('getRandomQuestion dispatches GET_RANDOM_QUESTION with a random question when there are questions available (item defined)', () => {
    return reduxStore.dispatch(actions.getRandomQuestion()).then(() => {
      // return of async actions
      expect(reduxStore.getActions()[1].type).toEqual(questionConstant.GET_RANDOM_QUESTION)
      const store = reduxStore.getActions()[1].data
      expect(store.kind).toBe(questionService.question.kind)
      // toEqual, because options are shuffled
      expect(store.item).toEqual(questionService.question.item)
      expect(store._id).toBe(questionService.question._id)
      expect(store.__v).toBe(questionService.question.__v)
    })
  })
  it('getRandomQuestion dipatches ADD_MESSAGE_FROM_BACKEND with a message when there are no questions available (message defined)', () => {
    questionService.getRandomQuestion = jest.fn(() => Promise.resolve({ message: 'No more questions' }))
    return reduxStore.dispatch(actions.getRandomQuestion()).then(() => {
      expect(reduxStore.getActions()[1].type).toEqual(questionConstant.ADD_MESSAGE_FROM_BACKEND)
      const store = reduxStore.getActions()[1].data
      expect(store).toEqual('No more questions')
    })
  })
  it('answerQuestion dispatches QUESTION_ANSWERED with answer object', () => {
    return reduxStore.dispatch(actions.answerQuestion()).then(() => {
      // return of async actions
      expect(reduxStore.getActions()[1].type).toEqual(questionConstant.QUESTION_ANSWERED)
      const store = reduxStore.getActions()[1].data
      expect(store.isCorrect).toBe(questionService.answer.isCorrect)
      expect(store.correctAnswer).toEqual(questionService.answer.correctAnswer)
    })
  })
  it('postCompileQuestion calls questionServices method postCompileQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.postCompileQuestion('correctAnswer', 'options')).then(() => {
      expect(questionService.postCompileQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.postCompileQuestion).toHaveBeenCalledWith('correctAnswer', 'options')
    })
  })
  it('postPrintQuestion calls questionServices method postPrintQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.postPrintQuestion('value', 'correctAnswer', 'options')).then(() => {
      expect(questionService.postPrintQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.postPrintQuestion).toHaveBeenCalledWith('value', 'correctAnswer', 'options')
    })
  })
  it('sendReviewForQuestion calls questionServices method sendReviewForQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.sendReviewForQuestion('12345', '5')).then(() => {
      expect(questionService.sendReviewForQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.sendReviewForQuestion).toHaveBeenCalledWith('12345', '5')
    })
  })
})
