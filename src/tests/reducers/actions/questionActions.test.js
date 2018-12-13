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
  describe('answerQuestion', () => {
    it('dispatches ANSWER_QUESTION and QUESTION_ANSWERED with correct data, WHEN there are no errors', () => {
      const returnValue = 'success'
      questionService.answerQuestion.mockReturnValueOnce(returnValue)
      return reduxStore.dispatch(actions.answerQuestion(123, 'vastaus', 'time')).then(() => {
        // return of async actions
        const storeActions = reduxStore.getActions()
        let containsAnswer = false
        let containsAnswered = false
        let containsMessage = false
        storeActions.forEach(action => {
          if (action.type === questionConstant.ANSWER_QUESTION) {
            containsAnswer = true
          }
          if (action.type === questionConstant.QUESTION_ANSWERED) {
            containsAnswered = true
            expect(action.data).toEqual(returnValue)
          }
          if (action.type === questionConstant.ADD_MESSAGE_FROM_BACKEND) {
            containsMessage = true
          }
        })
        expect(questionService.answerQuestion).toHaveBeenCalledWith(123, 'vastaus', 'time')
        expect(containsAnswer).toBe(true)
        expect(containsAnswered).toBe(true)
        expect(containsMessage).toBe(false)
      })
    })
    it('dispatches ANSWER_QUESTION and ADD_MESSAGE_FROM_BACKEND when there is an error', () => {
      const returnValue = { error: 'something went wrong' }
      questionService.answerQuestion.mockReturnValueOnce(returnValue)
      return reduxStore.dispatch(actions.answerQuestion(123, 'vastaus', 'time')).then(() => {
        // return of async actions
        const storeActions = reduxStore.getActions()
        let containsAnswer = false
        let containsAnswered = false
        let containsMessage = false
        storeActions.forEach(action => {
          if (action.type === questionConstant.ANSWER_QUESTION) {
            containsAnswer = true
          }
          if (action.type === questionConstant.QUESTION_ANSWERED) {
            containsAnswered = true
          }
          if (action.type === questionConstant.ADD_MESSAGE_FROM_BACKEND) {
            containsMessage = true
            expect(action.data).toEqual(returnValue.error)
          }
        })

        expect(questionService.answerQuestion).toHaveBeenCalledWith(123, 'vastaus', 'time')
        expect(containsAnswer).toBe(true)
        expect(containsAnswered).toBe(false)
        expect(containsMessage).toBe(true)
      })
    })
  })
  it('postCompileQuestion calls questionServices method postQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.postCompileQuestion('groupId', 'correctAnswer', 'options')).then(() => {
      expect(questionService.postQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.postQuestion).toHaveBeenCalledWith({
        type: 'compile',
        correctAnswer: 'correctAnswer',
        options: 'options',
        groupId: 'groupId'
      })
      questionService.postQuestion.mockClear()
    })
  })
  it('postPrintQuestion calls questionServices method postQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.postPrintQuestion('groupId', 'value', 'correctAnswer', 'options')).then(() => {
      expect(questionService.postQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.postQuestion).toHaveBeenCalledWith({
        type: 'print',
        value: 'value',
        correctAnswer: 'correctAnswer',
        options: 'options',
        groupId: 'groupId'
      })
      questionService.postQuestion.mockClear()
    })
  })
  it('sendReviewForQuestion calls questionServices method sendReviewForQuestion with correct parameters', () => {
    return reduxStore.dispatch(actions.sendReviewForQuestion('12345', '5')).then(() => {
      expect(questionService.sendReviewForQuestion).toHaveBeenCalledTimes(1)
      expect(questionService.sendReviewForQuestion).toHaveBeenCalledWith('12345', '5')
    })
  })
  describe('deleteQuestions', () => {
    it('dispatches DELETE_QUESTIONS with correct parameters if no response from service', () => {
      let param = [ '123', '456' ]
      return reduxStore.dispatch(actions.deleteQuestions(param)).then(() => {
        expect(questionService.deleteQuestions).toHaveBeenCalledTimes(1)
        expect(questionService.deleteQuestions).toHaveBeenCalledWith(param)
        let containsDelete = false
        const storeActions = reduxStore.getActions()
        storeActions.forEach(action => {
          if (action.type === questionConstant.DELETE_QUESTIONS) {
            containsDelete = true
            expect(action.data).toEqual(param)
          }
        })
        expect(containsDelete).toBe(true)
        questionService.deleteQuestions.mockClear()
      })
    })
    it('dispatches nothing if there is a response from questionServce', () => {
      let param = [ '123', '456' ]
      questionService.deleteQuestions.mockReturnValueOnce('whatever data')
      return reduxStore.dispatch(actions.deleteQuestions(param)).then(() => {
        expect(questionService.deleteQuestions).toHaveBeenCalledTimes(1)
        expect(questionService.deleteQuestions).toHaveBeenCalledWith(param)
        const storeActions = reduxStore.getActions()
        expect(storeActions).toEqual([])
        questionService.deleteQuestions.mockClear()
      })
    })
  })
  describe('unflagQuestions', () => {
    it('dispatches UNFLAG_QUESTIONS with correct parameters if no response from service', () => {
      let param = [ '123', '456' ]
      return reduxStore.dispatch(actions.unflagQuestions(param)).then(() => {
        expect(questionService.unflagQuestions).toHaveBeenCalledTimes(1)
        expect(questionService.unflagQuestions).toHaveBeenCalledWith(param)
        let containsUnflag = false
        const storeActions = reduxStore.getActions()
        storeActions.forEach(action => {
          if (action.type === questionConstant.UNFLAG_QUESTIONS) {
            containsUnflag = true
            expect(action.data).toEqual(param)
          }
        })
        expect(containsUnflag).toBe(true)
        questionService.unflagQuestions.mockClear()
      })
    })
    it('dispatches nothing if there is a response from questionServce', () => {
      let param = [ '123', '456' ]
      questionService.unflagQuestions.mockReturnValueOnce('whatever data')
      return reduxStore.dispatch(actions.unflagQuestions(param)).then(() => {
        expect(questionService.unflagQuestions).toHaveBeenCalledTimes(1)
        expect(questionService.unflagQuestions).toHaveBeenCalledWith(param)
        const storeActions = reduxStore.getActions()
        expect(storeActions).toEqual([])
        questionService.unflagQuestions.mockClear()
      })
    })
  })
  it('flagQuestion calls questionServices method flagQuestion', () => {
    return reduxStore.dispatch(actions.flagQuestion('questionID')).then(() => {
      expect(questionService.flagQuestion).toHaveBeenCalledWith('questionID')
    })
  })
  it('getDeletedQuestions dispatches FETCHING_QUESTION and GET_DELETED_QUESTIONS with correct data', () => {
    const returnValue = [ 'q1', 'q2' ]
    questionService.getDeletedQuestions.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.getDeletedQuestions()).then(() => {
      const storeActions = reduxStore.getActions()
      expect(storeActions[0].type).toEqual(questionConstant.FETCHING_QUESTION)

      expect(questionService.getDeletedQuestions).toHaveBeenCalledTimes(1)

      expect(storeActions[1].type).toEqual(questionConstant.GET_DELETED_QUESTIONS)
      expect(storeActions[1].data).toEqual(returnValue)
      questionService.getDeletedQuestions.mockClear()
    })
  })
  describe('restoreQuestions', () => {
    it('dispatches RESTORE_QUESTIONS with correct parameters if no response from service', () => {
      let param = [ '123', '456' ]
      return reduxStore.dispatch(actions.restoreQuestions(param)).then(() => {
        const storeActions = reduxStore.getActions()
        expect(questionService.restoreQuestions).toHaveBeenCalledWith(param)
        expect(storeActions[0].type).toEqual(questionConstant.RESTORE_QUESTIONS)
        expect(storeActions[0].data).toEqual(param)
        questionService.restoreQuestions.mockClear()
      })
    })
    it('dispatches nothing if there is a response from questionServce', () => {
      let param = [ '123', '456' ]
      questionService.restoreQuestions.mockReturnValueOnce('whatever data')
      return reduxStore.dispatch(actions.restoreQuestions(param)).then(() => {
        const storeActions = reduxStore.getActions()
        expect(questionService.restoreQuestions).toHaveBeenCalledWith(param)
        expect(storeActions).toEqual([])
        questionService.restoreQuestions.mockClear()
      })
    })
  })
  it('getAvailableQuestions dispatches FETCHING_QUESTION and GET_AVAILABLE_QUESTIONS with correct data', () => {
    const returnValue = [ 'q1', 'q2' ]
    questionService.getAvailableQuestions.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.getAvailableQuestions()).then(() => {
      const storeActions = reduxStore.getActions()
      expect(storeActions[0].type).toEqual(questionConstant.FETCHING_QUESTION)

      expect(questionService.getAvailableQuestions).toHaveBeenCalledTimes(1)

      expect(storeActions[1].type).toEqual(questionConstant.GET_AVAILABLE_QUESTIONS)
      expect(storeActions[1].data).toEqual(returnValue)
      questionService.getAvailableQuestions.mockClear()
    })
  })
  it('getAllFlaggedQuestions dispatches FETCHING_QUESTION and GET_FLAGGED_QUESTIONS with correct data', () => {
    const returnValue = [ 'q1', 'q2' ]
    questionService.getAllFlaggedQuestions.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.getAllFlaggedQuestions()).then(() => {
      const storeActions = reduxStore.getActions()
      expect(storeActions[0].type).toEqual(questionConstant.FETCHING_QUESTION)

      expect(questionService.getAllFlaggedQuestions).toHaveBeenCalledTimes(1)

      expect(storeActions[1].type).toEqual(questionConstant.GET_FLAGGED_QUESTIONS)
      expect(storeActions[1].data).toEqual(returnValue)
      questionService.getAllFlaggedQuestions.mockClear()
    })
  })
})
