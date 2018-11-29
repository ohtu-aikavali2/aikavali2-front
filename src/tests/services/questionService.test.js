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
  })
  describe('answerQuestion', () => {
    let answer
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            isCorrect: false,
            correctAnswer: 'Option1'
          }
        })
      )
    })
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
      answer = await questionService.answerQuestion()
      expect(answer).toEqual({
        isCorrect: false,
        correctAnswer: 'Option1'
      })
    })
  })
  // FIX TESTS
  /* describe('postCompileQuestion', () => {
    let response
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            fieldOne: 'fieldOne',
            fieldTwo: 'fieldTwo'
          }
        })
      )
    })
    afterAll(() => {
      mockAxios.post.mockClear()
    })
    it('calls axios post', async () => {
      response = await questionService.postCompileQuestion('correctAnswer', 'options')
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
    })
    describe('calls axios post with /api/v1/questions/compile, {correctAnswer, options} object and configs', () => {
      it('when token is not set', async () => {
        questionService.reload()
        response = await questionService.postCompileQuestion('correctAnswer', 'options')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/compile',
          {
            correctAnswer: 'correctAnswer',
            options: 'options'
          },
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        questionService.setToken(1337)
        response = await questionService.postCompileQuestion('correctAnswer', 'options')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/compile',
          {
            correctAnswer: 'correctAnswer',
            options: 'options'
          },
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
    it('returns response object from axios', async () => {
      response = await questionService.postCompileQuestion()
      expect(response).toEqual({
        fieldOne: 'fieldOne',
        fieldTwo: 'fieldTwo'
      })
    })
  })

  describe('postPrintQuestion', () => {
    let response
    beforeEach(() => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            fieldOne: 'fieldOne',
            fieldTwo: 'fieldTwo'
          }
        })
      )
    })
    afterAll(() => {
      mockAxios.post.mockClear()
    })
    it('calls axios post', async () => {
      response = await questionService.postPrintQuestion('value', 'correctAnswer', 'options')
      expect(mockAxios.post).toHaveBeenCalledTimes(1)
    })
    describe('calls axios post with /api/v1/questions/print, {value, correctAnswer, options} object and configs', () => {
      it('when token is not set', async () => {
        questionService.reload()
        response = await questionService.postPrintQuestion('value', 'correctAnswer', 'options')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/print',
          {
            value: 'value',
            correctAnswer: 'correctAnswer',
            options: 'options'
          },
          {
            headers: { 'Authorization': null }
          }
        )
      })
      it('when token is set', async () => {
        questionService.setToken(1337)
        response = await questionService.postPrintQuestion('value', 'correctAnswer', 'options')
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/api/v1/questions/print',
          {
            value: 'value',
            correctAnswer: 'correctAnswer',
            options: 'options'
          },
          {
            headers: { 'Authorization': 'bearer 1337' }
          }
        )
      })
    })
    it('returns response object from axios', async () => {
      response = await questionService.postPrintQuestion()
      expect(response).toEqual({
        fieldOne: 'fieldOne',
        fieldTwo: 'fieldTwo'
      })
    })
  }) */
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
})
