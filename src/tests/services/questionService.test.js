import mockAxios from 'axios'
jest.unmock('../../app/services/questionService')
import questionService from '../../app/services/questionService'

describe('questionService', () => {
  describe('getRandomQuestion', () => {
    let question
    beforeEach(() => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            kind: 'CompileQuestion',
            item: {
              options: [
                'if i > 1',
                '(if) i > 1',
                '(if i > 1)',
                'if (i > 1) {}'
              ]
            },
            _id: '5ba9d7b57cb50d03b2e4a9e3',
            __v: 0
          }
        })
      )
    })
    afterAll(() => {
      mockAxios.get.mockClear()
    })
    it('calls axios get', async () => {
      question = await questionService.getRandomQuestion()
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
    })
    describe('calls axios get with /api/v1/questions/random and configs', () => {
      it('when token is not set', async () => {
        question = await questionService.getRandomQuestion()
        expect(mockAxios.get).toHaveBeenCalledWith(
          '/api/v1/questions/random',
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        questionService.setToken(1337)
        question = await questionService.getRandomQuestion()
        expect(mockAxios.get).toHaveBeenCalledWith(
          '/api/v1/questions/random',
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
    it('returns question object from axios', async () => {
      question = await questionService.getRandomQuestion()
      expect(question).toEqual({
        kind: 'CompileQuestion',
        item: {
          options: [
            'if i > 1',
            '(if) i > 1',
            '(if i > 1)',
            'if (i > 1) {}'
          ]
        },
        _id: '5ba9d7b57cb50d03b2e4a9e3',
        __v: 0
      })
    })
    it('calls axios get with correct params, when course is set', async () => {
      await questionService.getRandomQuestion('courseName')
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/questions/random?course=courseName',
        {
          headers: { 'Authorization': 'bearer 1337' }
        }
      )
    })
  })
  describe('answerQuestion', () => {
    let answer
    afterAll(() => {
      mockAxios.post.mockClear()
    })
    it('calls axios post', async () => {
      answer = await questionService.answerQuestion()
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
    })
    describe('calls axios post with /api/v1/questions/answer, {id, value} object and configs', () => {
      it('when token is not set', async () => {
        questionService.reload()
        answer = await questionService.answerQuestion(12, 'answer')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/answer',
          {
            id: 12,
            answer: 'answer'
          },
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        questionService.setToken(1337)
        answer = await questionService.answerQuestion(12, 'answer')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/answer',
          {
            id: 12,
            answer: 'answer'
          },
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
    it('returns answer object from axios', async () => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            isCorrect: false,
            correctAnswer: 'Option1'
          }
        })
      )
      answer = await questionService.answerQuestion()
      expect(answer).toEqual({
        isCorrect: false,
        correctAnswer: 'Option1'
      })
    })
    it('returns an error when there is an error with axios post', async () => {
      mockAxios.post.mockImplementationOnce(() => { throw new Error('error') })
      let response = await questionService.answerQuestion()
      expect(response).toEqual({ error: 'Something went wrong while sending the answer' })
    })
  })
  describe('sendReviewForQuestion', () => {
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce()
    })
    afterAll(() => {
      mockAxios.post.mockClear()
    })
    it('calls axios post', () => {
      questionService.sendReviewForQuestion('12345', '3')
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
    })
    describe('calls axios post with /api/v1/reviews, {questionId, review} object and configs', () => {
      it('when token is not set', async () => {
        questionService.reload()
        await questionService.sendReviewForQuestion('123', '3')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/reviews',
          {
            questionId: '123',
            review: '3'
          },
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        questionService.setToken(1337)
        await questionService.sendReviewForQuestion('12345', '1')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/reviews',
          {
            questionId: '12345',
            review: '1'
          },
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
  })
  it ('sets token', () => {
    questionService.setToken(8783)
    expect(questionService.getToken()).toBe('bearer 8783')
  })
  it('postQuestion calls axios post with correct params and return correct data', async () => {
    mockAxios.post.mockReturnValueOnce({ data: 'dataFromBE' })
    let response = await questionService.postQuestion('question')
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/v1/questions',
      'question',
      {
        headers: { 'Authorization': 'bearer 8783' }
      }
    )
    expect(response).toEqual('dataFromBE')
  })
  describe('deleteQuestions', () => {
    it('calls axios put with correct parameters', async () => {
      await questionService.deleteQuestions([ 'id1', 'id2' ])
      expect(mockAxios.put).toHaveBeenCalledWith(
        '/api/v1/questions/delete',
        { questionIDs: [ 'id1', 'id2' ] },
        {
          headers: { 'Authorization': 'bearer 8783' }
        }
      )
    })
    it('returns error when there is an error in backend', async () => {
      mockAxios.put.mockImplementationOnce(() => { throw new Error('error') })
      let response = await questionService.deleteQuestions([ 'id1', 'id2' ])
      expect(response).toEqual({ error: 'Could not delete questions' })
    })
  })
  describe('unflagQuestions', () => {
    it('calls axios put with correct parameters', async () => {
      mockAxios.put.mockClear()
      await questionService.unflagQuestions([ 'id1', 'id2' ])
      expect(mockAxios.put).toHaveBeenCalledWith(
        '/api/v1/flags',
        { questionIDs: [ 'id1', 'id2' ] },
        {
          headers: { 'Authorization': 'bearer 8783' }
        }
      )
      mockAxios.put.mockClear()
    })
    it('returns error when there is an error in backend', async () => {
      mockAxios.put.mockClear()
      mockAxios.put.mockImplementationOnce(() => { throw new Error('error') })
      let response = await questionService.unflagQuestions([ 'id1', 'id2' ])
      expect(response).toEqual({ error: 'Could not unflag the questions' })
      mockAxios.put.mockClear()
    })
  })
  it('flagQuestion calls axios post with correct parameters', async () => {
    await questionService.flagQuestion('questionID')
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/v1/flags',
      { questionID: 'questionID' },
      {
        headers: { 'Authorization': 'bearer 8783' }
      }
    )
    mockAxios.post.mockClear()
  })
  describe('restoreQuestions', () => {
    it('calls axios put with correct parameters', async () => {
      await questionService.restoreQuestions([ 'id1', 'id2' ])
      expect(mockAxios.put).toHaveBeenCalledWith(
        '/api/v1/questions/restore',
        { questionIDs: [ 'id1', 'id2' ] },
        {
          headers: { 'Authorization': 'bearer 8783' }
        }
      )
    })
    it('returns error when there is an error in backend', async () => {
      mockAxios.put.mockImplementationOnce(() => { throw new Error('error') })
      let response = await questionService.restoreQuestions()
      expect(response).toEqual({ error: 'Could not restore the questions' })
    })
  })
  it('getAllFlaggedQuestions calls axios get with correct parameters and returns correct data', async () => {
    mockAxios.get.mockReturnValueOnce({ data: 'data' })
    let response = await questionService.getAllFlaggedQuestions()
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/v1/questions/flagged',
      {
        headers: { 'Authorization': 'bearer 8783' }
      }
    )
    expect(response).toEqual('data')
  })
  it('getDeletedQuestions calls axios get with correct params and returns correct data', async () => {
    mockAxios.get.mockReturnValueOnce({ data: 'data' })
    let response = await questionService.getDeletedQuestions()
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/v1/questions/deleted',
      {
        headers: { 'Authorization': 'bearer 8783' }
      }
    )
    expect(response).toEqual('data')
  })
  it('getAvailableQuestions calls axios get with correct params and returns correct data', async () => {
    mockAxios.get.mockReturnValueOnce({ data: 'data' })
    let response = await questionService.getAvailableQuestions()
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/v1/questions/available',
      {
        headers: { 'Authorization': 'bearer 8783' }
      }
    )
    expect(response).toEqual('data')
  })
})
