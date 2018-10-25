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
      noMoreQuestions: false,
      classes: {
        style: styles.style,
        icon: styles.icon
      }
    }
    buttonBar = shallow(<ButtonBar {...props} />)
  })
  it('renders self', () => {
    const bottomNavigation = buttonBar.find(BottomNavigation)
    expect(bottomNavigation.length).toBe(1)
    expect(bottomNavigation.props()).toEqual({
      value: 0,
      className: props.classes.style,
      showLabels: true,
      onChange: bottomNavigation.props().onChange,
      children: bottomNavigation.props().children
    })
  })
  it('renders the navigation options', () => {
    expect(buttonBar.find(BottomNavigationAction).length).toBe(3)
  })
  it('leftButton disabled when showNext == true or noMoreQuestions == true', () => {
    // Both are false
    let leftButton = buttonBar.find(BottomNavigationAction).at(0)
    expect(leftButton.props().disabled).toBe(false)

    // showNext == true, noMoreQuestions == false
    let tempProps = {
      ...props,
      showNext: true
    }
    let tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    leftButton = tempButtonBar.find(BottomNavigationAction).at(0)
    expect(leftButton.props().disabled).toBe(true)

    // showNext == false, noMoreQuestions == true
    tempProps = {
      ...props,
      noMoreQuestions: true
    }
    tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    leftButton = tempButtonBar.find(BottomNavigationAction).at(0)
    expect(leftButton.props().disabled).toBe(true)

    // Both are true
    tempProps = {
      ...props,
      noMoreQuestions: true,
      showNext: true
    }
    tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    leftButton = tempButtonBar.find(BottomNavigationAction).at(0)
    expect(leftButton.props().disabled).toBe(true)
  })
  it('middleButton is always enabled', () => {
    // If disabled == undefined, it is always enabled
    let middleButton = buttonBar.find(BottomNavigationAction).at(1)
    expect(middleButton.props().disabled).toBe(undefined)
  })
  it('rightButton disabled when showNext == false or noMoreQuestions == true', () => {
    // Both are false
    let rightButton = buttonBar.find(BottomNavigationAction).at(2)
    expect(rightButton.props().disabled).toBe(true)

    // showNext == true, noMoreQuestions == false
    let tempProps = {
      ...props,
      showNext: true
    }
    let tempButtonBar = shallow(<ButtonBar {...tempProps} />)
    rightButton = tempButtonBar.find(BottomNavigationAction).at(2)
    expect(rightButton.props().disabled).toBe(false)

    // showNext == false, noMoreQuestions == true
    tempProps = {
      ...props,
      noMoreQuestions: true
    }
    tempButtonBar = shallow(<ButtonBar {...tempProps} />)
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
  /*
  <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.style}
      >
        <BottomNavigationAction disabled={this.props.showNext || this.props.noMoreQuestions} onClick={this.props.handleSkip} label="Skip" icon={<SkipNextIcon className={classes.icon}/>}/>
        <BottomNavigationAction label="Home" icon={<HomeIcon className={classes.icon}/>} />
        <BottomNavigationAction disabled={!this.props.showNext || this.props.noMoreQuestions} onClick={this.props.handleSkip} label="Next" icon={<ForwardIcon className={classes.icon}/>}/>
      </BottomNavigation>
  */
  /*it('skip button press should call prop handleSkip', () => {
    const button = buttonBar.find(Button).first()
    expect(props.handleSkip.mock.calls.length).toBe(0)
    button.simulate('click')
    expect(props.handleSkip.mock.calls.length).toBe(1)
  })*/
  /*it('next button press should call prop handleSkip', () => {
    props = {
      ...props,
      showNext: true
    }
    buttonBar = shallow(<ButtonBar {...props} />)
    const button = buttonBar.find(Button).first()
    expect(props.handleSkip.mock.calls.length).toBe(0)
    button.simulate('click')
    expect(props.handleSkip.mock.calls.length).toBe(1)
  })*/
})
