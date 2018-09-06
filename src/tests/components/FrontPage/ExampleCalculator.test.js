import React from 'react'
import { shallow } from 'enzyme'
import ExampleCalculator from '../../../app/components/FrontPage/ExampleCalculator'

describe('<ExampleCalculator />', () => {
  it('renders', async () => {
    const exampleCalculatorComponent = shallow(<ExampleCalculator currentValue={2} />)
    const contentDiv = exampleCalculatorComponent.find('.current-value')

    expect(contentDiv.text()).toContain('Current value: 2')
  })
})