import React from 'react'
import { mount } from 'enzyme'
import PrintQuestion from '../../../app/components/Question/PrintQuestion'
import CompileQuestion from '../../../app/components/Question/CompileQuestion'
import Question from '../../../app/components/Question'
import store from '../../../app/reducers'
import { Provider } from 'react-redux'

describe('<Question />', () => {
  let question
  const props = [
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
    question = mount(<Provider store={store}><Question question={props[0]} /></Provider>)
  })

  it('renders self', () => {
    expect(question.find('.questionContainer').length).toBe(1)
  })
  it('renders only PrintQuestion when question.kind is PrintQuestion', () => {
    expect(question.find(CompileQuestion).length).toBe(0)
    expect(question.find(PrintQuestion).length).toBe(1)
  })
  it('renders only CompileQuestion when question.kind is CompileQuestion', () => {
    question = mount(<Provider store={store}><Question question={props[1]} /></Provider>)
    expect(question.find(CompileQuestion).length).toBe(1)
    expect(question.find(PrintQuestion).length).toBe(0)
  })
})