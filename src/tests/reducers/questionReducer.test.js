import questionReducer from '../../app/reducers/questionReducer'
import questionConstants from '../../app/reducers/constants/questionConstants'

describe('questionReducer', () => {
  it('should return initial state', () => {
    expect(questionReducer(undefined, {})).toEqual({
      question: null
    })
  })
  it('should handle GET_RANDOM_QUESTION', () => {
    const returnedQuestion = questionReducer(undefined, {
      type: questionConstants.GET_RANDOM_QUESTION,
      data: {
        type: 'test',
        value: 'testValue',
        options: ['option1']
      }
    })
    expect(returnedQuestion.question.type).toBe('test')
    expect(returnedQuestion.question.value).toBe('testValue')
    expect(returnedQuestion.question.options.length).toBe(1)
    expect(returnedQuestion.question.options[0]).toBe('option1')
  })
})
