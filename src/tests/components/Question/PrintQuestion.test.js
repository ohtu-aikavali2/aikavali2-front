import React from 'react'
import { mount } from 'enzyme'
import PrintQuestion from '../../../app/components/Question/PrintQuestion'
import QuestionAnswer from '../../../app/components/Question/QuestionAnswer'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'

describe('<PrintQuestion />', () => {
  let printQuestion
  const props = {
    kind: 'PrintQuestion',
    options: [
      'option1',
      'option2',
      'option3'
    ],
    value: 'testi kysymys'
  }
  beforeAll(() => {
    printQuestion = mount(<Provider store={store}><PrintQuestion question={props} /></Provider>)
  })
  it('renders self and subcomponents', () => {
    expect(printQuestion.find('.printQuestion').length).toBe(1)
    expect(printQuestion.find('.typography').length > 0).toBe(true)
    const typography = printQuestion.find('.typography').first()
    const text = typography.text()
    expect(text).toContain(props.value)
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
    expect(printQuestion.find(QuestionAnswer).length).toBe(3)
    let newProps = {
      ...props,
      options: [ ...props.options, 'option4' ]
    }
    let testComponent = mount(<Provider store={store}><PrintQuestion question={newProps} /></Provider>)
    expect(testComponent.find(QuestionAnswer).length).toBe(4)
  })
})