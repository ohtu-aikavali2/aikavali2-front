import questionReducer from '../../app/reducers/questionReducer'
import questionConstants from '../../app/reducers/constants/questionConstants'

describe('questionReducer', () => {
  let INITIAL_STATE, questionData, userAnswerData, messageData
  beforeAll(() => {
    INITIAL_STATE = {
      question: null,
      userAnswer: null,
      message: null
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
      message: null
    })
  })
  it('GET_RANDOM_QUESTION should set question to action.data, userAnswer: null and message: null', () => {
    const data = questionData
    const returnedQuestion = questionReducer({ ...INITIAL_STATE, userAnswer: 'Something', message: 'something' }, {
      type: questionConstants.GET_RANDOM_QUESTION,
      data
    })
    expect(returnedQuestion).toEqual({
      question: questionData,
      userAnswer: null,
      message: null
    })
  })
  it('QUESTION_ANSWERED should set userAnswer to action.data and keep other fields as they are', () => {
    const data = userAnswerData
    const returnedAnswer = questionReducer({ ...INITIAL_STATE, question: 'Something' }, {
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
    expect(returnedAnswer).toEqual({
      ...INITIAL_STATE,
      question: 'Something',
      userAnswer: userAnswerData
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
})
