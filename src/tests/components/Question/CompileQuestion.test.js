import React from 'react'
import { shallow } from 'enzyme'
import { CompileQuestion } from '../../../app/components/Question/CompileQuestion'
import QuestionAnswer from '../../../app/components/Question/QuestionAnswer'
import Typography from '@material-ui/core/Typography'

describe('<CompileQuestion />', () => {
  let compileQuestion
  const props = {
    question: {
      _id: 12314,
      kind: 'CompileQuestion',
      options: [
        'option1',
        'option2',
        'option3'
      ]
    }
  }
  beforeAll(() => {
    compileQuestion = shallow(<CompileQuestion {...props} />)
  })
  it('renders self and subcomponents', () => {
    expect(compileQuestion.find('.compileQuestion').length).toBe(1)
    const typography = compileQuestion.find(Typography)
    expect(typography.length).toBe(1)
    const text = typography.props().children
    expect(text).toContain('Valitse mikä koodinpätkä kääntyy')
    const typographyProps = typography.props()
    expect(typographyProps).toEqual({
      className: 'typography',
      variant: 'headline',
      align: 'center',
      color: 'default',
      gutterBottom: true,
      children: typographyProps.children
    })
  })
  it('renders as many QuestionAnswers as there are question options', () => {
    expect(compileQuestion.find(QuestionAnswer).length).toBe(3)
    let newProps = {
      ...props,
      question: {
        ...props.question,
        options: [
          ...props.question.options,
          'option4'
        ]
      }
    }
    let testComponent = shallow(<CompileQuestion {...newProps} />)
    expect(testComponent.find(QuestionAnswer).length).toBe(4)
  })
})
