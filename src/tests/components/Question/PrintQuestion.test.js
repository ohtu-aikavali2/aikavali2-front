import React from 'react'
import { shallow } from 'enzyme'
import PrintQuestion from '../../../app/components/Question/PrintQuestion'

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
    printQuestion = shallow(<PrintQuestion question={props} />)
  })
  it('renders self, subcomponents and answer options', () => {
    expect(printQuestion.find('.printQuestion').length).toBe(1)
    const text = printQuestion.find('.printQuestion').text()
    expect(text).toContain('PRINT QUESTION')
    expect(text).toContain(props.value)
    expect(text).toContain(props.options[0])
    expect(text).toContain(props.options[1])
    expect(text).toContain(props.options[2])
  })
})