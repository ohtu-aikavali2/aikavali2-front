import React from 'react'
import { shallow } from 'enzyme'
import PrintQuestion from '../../../app/components/Question/PrintQuestion'
import CompileQuestion from '../../../app/components/Question/CompileQuestion'
import { Question } from '../../../app/components/Question'

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
    props = { question: questions[0] }
    question = shallow(<Question {...props} />)
  })

  it('renders self', () => {
    expect(question.find('.questionContainer').length).toBe(1)
  })
  it('renders only PrintQuestion when question.kind is PrintQuestion', () => {
    expect(question.find(CompileQuestion).length).toBe(0)
    expect(question.find(PrintQuestion).length).toBe(1)
  })
  it('renders only CompileQuestion when question.kind is CompileQuestion', () => {
    props = { question: questions[1] }
    question = shallow(<Question {...props} />)
    expect(question.find(CompileQuestion).length).toBe(1)
    expect(question.find(PrintQuestion).length).toBe(0)
  })
})