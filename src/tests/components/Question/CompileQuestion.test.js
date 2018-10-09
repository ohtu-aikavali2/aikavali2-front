import React from 'react'
import { mount } from 'enzyme'
import CompileQuestion from '../../../app/components/Question/CompileQuestion'
import { QuestionAnswer } from '../../../app/components/Question/QuestionAnswer'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'

describe('<CompileQuestion />', () => {
  let compileQuestion
  const props = {
    _id: 12314,
    kind: 'CompileQuestion',
    options: [
      'option1',
      'option2',
      'option3'
    ]
  }
  beforeAll(() => {
    // withStyles won't work without a Provider and store
    compileQuestion = mount(<Provider store={store}><CompileQuestion question={props} /></Provider>)
  })
  it('renders self and subcomponents', () => {
    expect(compileQuestion.find('.compileQuestion').length).toBe(1)
    expect(compileQuestion.find('.typography').length > 0).toBe(true)
    const typography = compileQuestion.find('.typography').first()
    const text = typography.text()
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
      options: [ ...props.options, 'option4' ]
    }
    let testComponent = mount(<Provider store={store}><CompileQuestion question={newProps} /></Provider>)
    expect(testComponent.find(QuestionAnswer).length).toBe(4)
  })
})
