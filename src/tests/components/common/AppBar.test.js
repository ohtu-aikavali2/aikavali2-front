import React from 'react'
import { shallow } from 'enzyme'
import { ButtonAppBar } from '../../../app/components/common/AppBar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'

describe('<AppBar />', () => {
  let appBar
  const props = {
    logout: jest.fn(),
    user: {
      id: '123',
      username: 'Pate1337'
    }
  }
  beforeAll(() => {
    appBar = shallow(<ButtonAppBar {...props} />)
  })
  it('renders self and subcomponents', () => {
    expect(appBar.find('.appBar').length).toBe(1)
    expect(appBar.find(AppBar).length).toBe(1)
  })
  it('renders app title', () => {
    const titleContainer = appBar.find('.appBarTitle')
    expect(titleContainer.length).toBe(1)
  })
  it('renders logout button if user is logged in', () => {
    const logoutContainer = appBar.find('.appBarLoginContainer')
    expect(logoutContainer.length).toBe(1)
    expect(logoutContainer.children().find(Button).length).toBe(1)
  })
  it('does not render logout button is user is not logged in', () => {
    appBar.setProps({
      user: null
    })
    const logoutContainer = appBar.find('.appBarLoginContainer')
    expect(logoutContainer.length).toBe(0)
    expect(logoutContainer.children().find(Button).length).toBe(0)
  })
  it('doesnt render menu button on if user is not logged in (user is null)', () => {
    const menuButtonContainer = appBar.find('.appBarMenuButton')
    expect(menuButtonContainer.length).toBe(0)
    expect(menuButtonContainer.children().find(IconButton).length).toBe(0)
    expect(menuButtonContainer.children().find(MenuIcon).length).toBe(0)
  })
  it('Logout button click should call given prop logout', () => {
    appBar.setProps({
      user: props.user
    })
    const logoutContainer = appBar.find('.appBarLoginContainer')
    const logoutButton = logoutContainer.children().find(Button)
    expect(props.logout).toHaveBeenCalledTimes(0)
    logoutButton.simulate('click')
    expect(props.logout).toHaveBeenCalledTimes(1)
    props.logout.mockClear()
  })
})
