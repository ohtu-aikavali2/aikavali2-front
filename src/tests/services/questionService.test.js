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
    it('calls axios post', async () => {
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
  it ('sets token', () => {
    questionService.setToken(8783)
    expect(questionService.getToken()).toBe('bearer 8783')
  })
})
