import React from 'react'
import { shallow } from 'enzyme'
import Button from '../../../app/components/common/Button'

describe('<Button />', () => {
  it('renders and handles click', async () => {
    let isActivated = false
    const exampleButton = shallow(<Button value='test' handleClick={() => isActivated = true}/>)
    const buttonContent = exampleButton.find('.button')
    expect(buttonContent.text()).toContain('test')
    exampleButton.simulate('click')
    expect(isActivated).toBe(true)
  })
})