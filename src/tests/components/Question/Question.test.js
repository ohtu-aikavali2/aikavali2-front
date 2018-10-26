import React from 'react'
import { shallow } from 'enzyme'
import PrintQuestion from '../../../app/components/Question/PrintQuestion'
import CompileQuestion from '../../../app/components/Question/CompileQuestion'
import { Question } from '../../../app/components/Question'
import AlertWindow from '../../../app/components/common/AlertWindow'
import ButtonBar from '../../../app/components/common/ButtonBar'

describe('<Question />', () => {
  let props, question
  let questions = [
    {
      kind: 'PrintQuestion',
      item: {
        options: [
          'option1',
          'option2',
          'option3'
        ],
        value: 'testi kysymys',
        _id: '12345'
      }
    },
    {
      kind: 'CompileQuestion',
      item: {
        options: [
          'option1',
          'option2',
          'option3'
        ],
        _id: '6789'
      }
    }
  ]

  beforeAll(() => {
    props = {
      question: questions[0],
      game: {
        paused: false,
        ended: false
      },
      userAnswer: null,
      questionMessage: null,
      getRandomQuestion: jest.fn(),
      answerQuestion: jest.fn(),
      initializeGame: jest.fn(),
      startGame: jest.fn(),
      endGame: jest.fn(),
      loggedUser: {
        loggedUser: 'not null'
      }
    }
    question = shallow(<Question {...props} />)
  })
  afterEach(() => {
    props.getRandomQuestion.mockClear()
    props.answerQuestion.mockClear()
    props.initializeGame.mockClear()
    props.startGame.mockClear()
    props.endGame.mockClear()
  })

  it('renders self', () => {
    expect(question.find('.questionContainer').length).toBe(1)
  })
  it('renders AlertWindow with correct props when question.message is defined', () => {
    question.setProps({
      ...props,
      questionMessage: 'Message from backend'
    })
    expect(question.find(AlertWindow).length).toBe(1)
    let alertWindowProps = question.find(AlertWindow).props()
    expect(alertWindowProps).toEqual({
      title: 'Message from backend',
      neutral: true,
      children: alertWindowProps.children
    })
  })
  it('renders only PrintQuestion when question.kind is PrintQuestion', () => {
    expect(question.find(CompileQuestion).length).toBe(0)
    expect(question.find(PrintQuestion).length).toBe(1)
  })
  it('renders only CompileQuestion when question.kind is CompileQuestion', () => {
    question.setProps({
      ...props,
      question: questions[1],
      game: {
        started: true,
        ended: false
      }
    })
    expect(question.find(CompileQuestion).length).toBe(1)
    expect(question.find(PrintQuestion).length).toBe(0)
  })
  it('renders ButtonBar with correct props', () => {
    expect(question.find(ButtonBar).length).toBe(1)
    const buttonBarProps = question.find(ButtonBar).props()
    expect(buttonBarProps).toEqual({
      handleSkip: buttonBarProps.handleSkip,
      showNext: props.userAnswer !== null,
      noMoreQuestions: props.questionMessage !== null
    })
  })
  it('renders offset div', () => {
    expect(question.find('.offset').length).toBe(1)
  })
  describe('componentWillReceiveProps', () => {
    afterEach(() => {
      props.getRandomQuestion.mockClear()
      props.answerQuestion.mockClear()
      props.initializeGame.mockClear()
      props.startGame.mockClear()
      props.endGame.mockClear()
    })
    it('sets pauseStart time to state if game is set to pause and not the first question', () => {
      question.setState({ startTime: Date.now() })
      question.setProps({
        ...props,
        game: {
          paused: true,
          ended: false
        }
      })
      expect(question.state().pauseStart !== 0 && question.state().pauseStart !== null).toBe(true)
    })
    it('sets a new startTime if game is unpaused', () => {
      let previousStartTime = question.state().startTime
      question.setProps({
        ...props,
        game: {
          paused: false,
          ended: false
        }
      })
      expect(question.state().pauseStart).toEqual(0)
      expect(question.state().startTime > previousStartTime).toBe(true)
    })
    it('calls endGame if questions have ended', () => {
      question.setProps({
        ...props,
        questionMessage: 'end',
        game: {
          paused: false,
          ended: false
        }
      })
      expect(props.endGame).toHaveBeenCalledTimes(1)
    })
    it('starts an interval and calls getRandomQuestion when game ends and there is no interval yet', () => {
      question.setProps({
        ...props,
        game: {
          ended: true,
          paused: false
        },
        questionMessage: 'not null'
      })
      expect(question.state().timer !== null).toBe(true)
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      }, 50)
    })
    it('clears interval and calls initializeGame when new questions are available', () => {
      question.setProps({
        ...props,
        game: {
          ended: true,
          paused: false
        },
        questionMessage: null
      })
      expect(question.state()).toEqual({
        selected: null,
        startTime: 0,
        pauseStart: 0,
        timer: null,
        showReview: false,
        reviewed: false
      })
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
    })
  })
  describe('handleAnswer()', () => {
    beforeAll(() => {
      question.setState({ startTime: 0 })
      question.instance().handleAnswer('1234', 'value')
    })
    it('sets selected option to state', () => {
      expect(question.state().selected).toEqual({ id: '1234', value: 'value' })
    })
    it('calls props.answerQuestion with the right parameters', () => {
      setTimeout(() => {
        expect(props.answerQuestion).toHaveBeenCalledWith('1234', 'value', 0)
      }, 50)

      // When startTime is not 0
      const startTime = Date.now()
      question.setState({ startTime })
      // Mocking the Date.now()
      // eslint-disable-next-line
      const realDateNow = Date.now.bind(global.Date)
      const dateNowStub = jest.fn(() => startTime + 5)
      // eslint-disable-next-line
      global.Date.now = dateNowStub
      question.instance().handleAnswer('1234', 'value')
      setTimeout(() => {
        expect(props.answerQuestion).toHaveBeenCalledWith('1234', 'value', 5)
      }, 50)
      // Setting Date.now() back to original
      // eslint-disable-next-line
      global.Date.now = realDateNow
    })
  })
  describe('getNewQuestion()', () => {
    it('calls components method skipQuestion() if question has not been answered', () => {
      question.setProps({ userAnswer: null })
      question.setState({ selected: null })
      const spy = jest.spyOn(question.instance(), 'skipQuestion')
      expect(spy).toHaveBeenCalledTimes(0)

      question.instance().getNewQuestion()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(0)
    })
    it('calls props.getRandomQuestion if question has been answered', () => {
      question.setProps({ userAnswer: 'not null' })
      question.setState({ selected: 'not null' })
      question.instance().getNewQuestion()
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
    })
    it('sets selected: null and startTime: Date.now() to state', () => {
      expect(question.state().selected).toEqual(null)
      expect(question.state().startTime > 0).toBe(true)
    })
  })
  describe('skipQuestion()', () => {
    beforeAll(() => {
      question.setState({ selected: 'not null' })
      question.instance().skipQuestion()
    })
    it('calls props.answerQuestion with the correct parameters', () => {
      expect(props.answerQuestion).toHaveBeenCalledWith('12345', 'Note: questionSkipped', null)
    })
    it('sets selected: { id: props.question._id, value: } to state', () => {
      expect(question.state().selected).toEqual({ id: '12345', value: 'Note: questionSkipped' })
    })
  })
  it('componentWillUnmount clears interval', () => {
    jest.useFakeTimers()
    question.instance().componentWillUnmount()
    expect(clearInterval).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})
