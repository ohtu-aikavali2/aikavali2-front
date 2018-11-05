import questionReducer from '../../app/reducers/questionReducer'
import questionConstants from '../../app/reducers/constants/questionConstants'

describe('questionReducer', () => {
  let INITIAL_STATE, questionData, userAnswerData, messageData
  beforeAll(() => {
    INITIAL_STATE = {
      question: null,
      userAnswer: null,
      message: null,
      answering: false,
      loading: false
    }
    questionData = {
      type: 'test',
      value: 'testValue',
      options: ['option1']
    }
    userAnswerData = {
      isCorrect: false,
      correctAnswer: 'if (i > 1) {}'
    }
    messageData = {
      message: 'Message fro backend'
    }
  })
  it('should return initial state', () => {
    expect(questionReducer(undefined, {})).toEqual({
      question: null,
      userAnswer: null,
      message: null,
      loading: false,
      answering: false
    })
  })
  it('GET_RANDOM_QUESTION should set question to action.data, userAnswer: null and message: null', () => {
    const data = questionData
    const returnedQuestion = questionReducer({ ...INITIAL_STATE, userAnswer: 'Something', message: 'something' }, {
      type: questionConstants.GET_RANDOM_QUESTION,
      data
    })
    expect(returnedQuestion).toEqual({
      ...INITIAL_STATE,
      question: questionData,
      userAnswer: null,
      message: null,
      loading: false
    })
  })
  it('QUESTION_ANSWERED should set userAnswer to action.data, answering to false and keep other fields as they are', () => {
    const data = userAnswerData
    const returnedAnswer = questionReducer({ ...INITIAL_STATE, question: 'Something', answering: true }, {
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
    expect(returnedAnswer).toEqual({
      ...INITIAL_STATE,
      question: 'Something',
      userAnswer: userAnswerData,
      answering: false
    })
  })
  it('ADD_MESSAGE_FROM_BACKEND should set message to action.data, userAnswer: null and question: null', () => {
    const data = messageData
    const reducerState = questionReducer({ ...INITIAL_STATE, message: 'jii', userAnswer: 'täällä jotain', question: 'täällä kans' }, {
      type: questionConstants.ADD_MESSAGE_FROM_BACKEND,
      data
    })
    expect(reducerState).toEqual({
      ...INITIAL_STATE,
      userAnswer: null,
      question: null,
      message: messageData
    })
  })
  it('ANSWER_QUESTION should set answering: true', () => {
    expect(questionReducer({ ...INITIAL_STATE, answering: false }, {
      type: questionConstants.ANSWER_QUESTION
    })).toEqual({
      ...INITIAL_STATE,
      answering: true
    })
  })
})
