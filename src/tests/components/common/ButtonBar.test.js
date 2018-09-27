import React from 'react'
// import { mount } from 'enzyme'
import ButtonBar from '../../../app/components/common/ButtonBar'
import Button from '@material-ui/core/Button'
import { createMount } from '@material-ui/core/test-utils'
import SkipNext from '@material-ui/icons/SkipNext'
import Confirm from '@material-ui/icons/Check'

describe('<ButtonBar />', () => {
  let buttonBar
  let mount
  const props = {
    handleSkip: jest.fn(),
    handleConfirm: jest.fn()
  }
  beforeEach(() => {
    mount = createMount()
    buttonBar = mount(<ButtonBar {...props} />)
  })
  it('renders self and subcomponents', () => {
    const allButtons = buttonBar.find(Button)
    expect(allButtons.length).toBe(2)
    expect(buttonBar.find('.leftButton').first().text()).toContain('Skip')
    expect(buttonBar.find('.rightButton').first().text()).toContain('Confirm')
    expect(buttonBar.find('.leftButton').first().find(SkipNext).length).toBe(1)
    expect(buttonBar.find('.rightButton').first().find(Confirm).length).toBe(1)
  })
  it('skip button press should call prop handleSkip', () => {
    const button = buttonBar.find('.leftButton').first()
    expect(props.handleSkip.mock.calls.length).toBe(0)
    button.simulate('click')
    expect(props.handleSkip.mock.calls.length).toBe(1)
  })
  it('confirm button press should call prop handeConfirm', () => {
    const button = buttonBar.find('.rightButton').first()
    expect(props.handleConfirm.mock.calls.length).toBe(0)
    button.simulate('click')
    expect(props.handleConfirm.mock.calls.length).toBe(1)
  })
})