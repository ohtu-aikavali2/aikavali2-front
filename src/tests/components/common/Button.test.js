import React from 'react'
import { shallow } from 'enzyme'
import Button from '../../../app/components/common/Button'

describe('<Button />', () => {
  it('renders button with text and handles click', () => {
    const mockHandler = jest.fn()
    const button = shallow(<Button value='test' handleClick={mockHandler} />)
    button.simulate('click')
    expect(mockHandler.mock.calls.length).toBe(1)
    const buttonContent = button.find('.button')
    expect(buttonContent.text()).toContain('test')
  })
})