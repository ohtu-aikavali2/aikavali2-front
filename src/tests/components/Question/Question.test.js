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
        value: 'testi kysymys'
      }
    },
    {
      kind: 'CompileQuestion',
      item: {
        options: [
          'option1',
          'option2',
          'option3'
        ]
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
      loggedUser: null
    }
    question = shallow(<Question {...props} />)
  })

  it('renders self', () => {
    expect(question.find('.questionContainer').length).toBe(1)
  })
  it('renders AlertWindow with correct props when question.message is defined', () => {
    let newProps = {
      ...props,
      questionMessage: 'Message from backend'
    }
    let newQuestion = shallow(<Question {...newProps} />)
    expect(newQuestion.find(AlertWindow).length).toBe(1)
    let alertWindowProps = newQuestion.find(AlertWindow).props()
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
    let newProps = {
      ...props,
      question: questions[1],
      game: {
        started: true,
        ended: false
      }
    }
    question = shallow(<Question {...newProps} />)
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
})
