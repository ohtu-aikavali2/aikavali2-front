import React from 'react'
import { shallow } from 'enzyme'
import { PrintQuestion } from '../../../app/components/Question/PrintQuestion'
import QuestionAnswer from '../../../app/components/Question/QuestionAnswer'
import Typography from '@material-ui/core/Typography'

describe('<PrintQuestion />', () => {
  let printQuestion
  const props = {
    question: {
      kind: 'PrintQuestion',
      options: [
        'option1',
        'option2',
        'option3'
      ],
      value: 'testi kysymys'
    }
  }
  beforeAll(() => {
    printQuestion = shallow(<PrintQuestion {...props} />)
  })
  it('renders self and subcomponents', () => {
    expect(printQuestion.find('.printQuestion').length).toBe(1)
    const typo = printQuestion.find(Typography)
    expect(typo.length).toBe(1)
    expect(typo.first().props().children).toEqual('Mitä koodi tulostaa?')
    const typographyProps = typo.first().props()
    expect(typographyProps).toEqual({
      className: 'typography',
      variant: 'headline',
      align: 'center',
      color: 'default',
      gutterBottom: true,
      children: typographyProps.children
    })
    expect(printQuestion.find('.titleContainer').length).toBe(1)
    expect(printQuestion.find('.rowContainer').length).toBe(1)
  })
  // This is test is currently not valid, since the headline doesn't use markdown anymore
  //
  // it('renders question in multiple lines if required', () => {
  //   expect(printQuestion.find(ReactMarkdown).props().source).toEqual('```\ntesti kysymys\n```')
  //   let newProps = {
  //     ...props,
  //     question: {
  //       ...props.question,
  //       value: 'eka rivi\ntoka rivi\nkolmas rivi'
  //     }
  //   }
  //   let testComponent = shallow(<PrintQuestion {...newProps} />)
  //   const markDownValue = testComponent.find(ReactMarkdown).props().source
  //   expect(markDownValue).toEqual('```\neka rivi\ntoka rivi\nkolmas rivi\n```')
  // })
  it('renders as many QuestionAnswers as there are question options', () => {
    expect(printQuestion.find(QuestionAnswer).length).toBe(3)
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
    let testComponent = shallow(<PrintQuestion {...newProps} />)
    expect(testComponent.find(QuestionAnswer).length).toBe(4)
  })
})
