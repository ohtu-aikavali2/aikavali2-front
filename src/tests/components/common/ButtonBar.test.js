import React from 'react'
import { shallow } from 'enzyme'
import { ButtonBar, styles } from '../../../app/components/common/ButtonBar'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

describe('<ButtonBar />', () => {
  let buttonBar, props
  beforeAll(() => {
    props = {
      handleSkip: jest.fn(),
      showNext: false,
      noMoreQuestions: false
    }
    buttonBar = shallow(<ButtonBar {...props} />)
  })
  it('renders self', () => {
    const bottomNavigation = buttonBar.find(BottomNavigation)
    expect(bottomNavigation.length).toBe(1)
    expect(bottomNavigation.props()).toEqual({
      style: styles.bottomNav,
      showLabels: true,
      onChange: bottomNavigation.props().onChange,
      children: bottomNavigation.props().children
    })
  })
  it('renders the navigation options', () => {
    expect(buttonBar.find(BottomNavigationAction).length).toBe(3)
  })
  // Uncomment when middleButton exists
  /*it('middleButton is always enabled', () => {
    // If disabled == undefined, it is always enabled
    let middleButton = buttonBar.find(BottomNavigationAction).at(1)
    expect(middleButton.props().disabled).toBe(undefined)
  })*/
  it('rightButton disabled when noMoreQuestions == true', () => {
    // Both are false
    let rightButton = buttonBar.find(BottomNavigationAction).at(2)
    expect(rightButton.props().disabled).toBe(false)

    // showNext == false, noMoreQuestions == true
    let tempProps = {
      ...props,
      noMoreQuestions: true
    }
    let tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    rightButton = tempButtonBar.find(BottomNavigationAction).at(2)
    expect(rightButton.props().disabled).toBe(true)

    // Both are true
    tempProps = {
      ...props,
      noMoreQuestions: true,
      showNext: true
    }
    tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    rightButton = tempButtonBar.find(BottomNavigationAction).at(2)
    expect(rightButton.props().disabled).toBe(true)
  })
  it('on right button click the prop handleSkip is called', () => {
    let rightButton = buttonBar.find(BottomNavigationAction).at(2)
    expect(props.handleSkip).toHaveBeenCalledTimes(0)
    rightButton.simulate('click')
    expect(props.handleSkip).toHaveBeenCalledTimes(1)
    props.handleSkip.mockClear()
  })
  it('handleChange should set state.value to the on in param', () => {
    buttonBar.instance().handleChange('3')
    expect(buttonBar.state().value).toEqual('3')
  })
})
