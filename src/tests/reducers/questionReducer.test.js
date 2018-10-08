import questionReducer from '../../app/reducers/questionReducer'
import questionConstants from '../../app/reducers/constants/questionConstants'

describe('questionReducer', () => {
  let INITIAL_STATE, questionData, userAnswerData
  beforeAll(() => {
    INITIAL_STATE = {
      question: null,
      userAnswer: null,
      selectedAnswer: null
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
  })
  it('should return initial state', () => {
    expect(questionReducer(undefined, {})).toEqual({
      question: null,
      userAnswer: null,
      selectedAnswer: null
    })
  })
  it('GET_RANDOM_QUESTION should set question to action.data and userAnswer: null and selectedAnswer: null', () => {
    const data = questionData
    const returnedQuestion = questionReducer({ ...INITIAL_STATE, userAnswer: 'Something' }, {
      type: questionConstants.GET_RANDOM_QUESTION,
      data
    })
    expect(returnedQuestion).toEqual({
      question: questionData,
      userAnswer: null,
      selectedAnswer: null
    })
  })
  it('QUESTION_ANSWERED should set userAnswer to action.data and keep other fields as they are', () => {
    const data = userAnswerData
    const returnedAnswer = questionReducer({ ...INITIAL_STATE, question: 'Something' }, {
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
    expect(returnedAnswer).toEqual({
      question: 'Something',
      userAnswer: userAnswerData,
      selectedAnswer: INITIAL_STATE.selectedAnswer
    })
  })
})
