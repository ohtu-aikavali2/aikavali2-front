import questionReducer from '../../app/reducers/questionReducer'
import questionConstants from '../../app/reducers/constants/questionConstants'

describe('questionReducer', () => {
  let INITIAL_STATE, questionData, userAnswerData, messageData, stateWithData
  beforeAll(() => {
    INITIAL_STATE = {
      question: null,
      userAnswer: null,
      message: null,
      answering: false,
      loading: false,
      flaggedQuestions: [],
      deletedQuestions: [],
      questions: [],
      concepts: []
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
    stateWithData = {
      ...INITIAL_STATE,
      questions: [
        {
          _id: '123'
        },
        {
          _id: '456'
        }
      ],
      flaggedQuestions: [
        {
          _id: '123'
        },
        {
          _id: '789'
        }
      ],
      deletedQuestions: [
        {
          _id: '12345'
        },
        {
          _id: '67890'
        },
        {
          _id: '0997'
        }
      ]
    }
  })
  it('should return initial state', () => {
    expect(questionReducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  it('GET_RANDOM_QUESTION should set question to action.data, userAnswer: null, message: null and loading: false', () => {
    const data = questionData
    const returnedQuestion = questionReducer({ ...INITIAL_STATE, userAnswer: 'Something', message: 'something', loading: true }, {
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
  it('FETCHING_QUESTION should set loading: true, question: null and userAnswer: null', () => {
    expect(questionReducer({
      ...INITIAL_STATE,
      question: 'will be removed',
      userAnswer: 'will be removed'
    }, {
      type: questionConstants.FETCHING_QUESTION
    })).toEqual({
      ...INITIAL_STATE,
      loading: true
    })
  })
  it('GET_FLAGGED_QUESTIONS should set new flaggedQuestions and set loading: false', () => {
    expect(questionReducer({ ...INITIAL_STATE, loading: true }, {
      type: questionConstants.GET_FLAGGED_QUESTIONS,
      data: ['flagged1', 'flagged2']
    })).toEqual({
      ...INITIAL_STATE,
      flaggedQuestions: ['flagged1', 'flagged2']
    })
  })
  it('GET_DELETED_QUESTIONS should set new deletedQuestions and set loading: false', () => {
    expect(questionReducer({ ...INITIAL_STATE, loading: true }, {
      type: questionConstants.GET_DELETED_QUESTIONS,
      data: ['deleted1', 'deleted2']
    })).toEqual({
      ...INITIAL_STATE,
      deletedQuestions: ['deleted1', 'deleted2']
    })
  })
  // Should probably also add the questions to deletedQuestions..
  it('DELETE_QUESTIONS should delete the given questions from flaggedQuestions and questions', () => {
    expect(questionReducer(stateWithData, {
      type: questionConstants.DELETE_QUESTIONS,
      data: ['123', '456']
    })).toEqual({
      ...stateWithData,
      questions: [],
      flaggedQuestions: [
        {
          _id: '789'
        }
      ]
    })
  })
  it('UNFLAG_QUESTIONS should delete the given questions from flaggedQuestions', () => {
    expect(questionReducer(stateWithData, {
      type: questionConstants.UNFLAG_QUESTIONS,
      data: ['123']
    })).toEqual({
      ...stateWithData,
      flaggedQuestions: [
        {
          _id: '789'
        }
      ]
    })
  })
  it('RESTORE_QUESTIONS should delete the given questions from deletedQuestions', () => {
    expect(questionReducer(stateWithData, {
      type: questionConstants.RESTORE_QUESTIONS,
      data: ['12345', '67890']
    })).toEqual({
      ...stateWithData,
      deletedQuestions: [
        {
          _id: '0997'
        }
      ]
    })
  })
  it('GET_AVAILABLE_QUESTIONS should set new questions and set loading: false', () => {
    expect(questionReducer({ ...stateWithData, loading: true }, {
      type: questionConstants.GET_AVAILABLE_QUESTIONS,
      data: ['q1', 'q2']
    })).toEqual({
      ...stateWithData,
      questions: ['q1', 'q2'],
      loading: false
    })
  })
})
