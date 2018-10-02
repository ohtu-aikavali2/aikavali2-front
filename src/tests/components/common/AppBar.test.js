import React from 'react'
import { mount } from 'enzyme'
import AppBar from '../../../app/components/common/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AppBarMaterial from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'

describe('<AppBar />', () => {
  let appBar
  const props = {
    toggleDrawer: jest.fn()
  }
  beforeAll(() => {
    appBar = mount(<AppBar {...props} />)
  })
  it('renders self and subcomponents', () => {
    expect(appBar.find('.appBar').text()).toContain('Aikavälikertaus')
    const appBarComponent = appBar.find(AppBarMaterial)
    expect(appBarComponent.hasClass('appBar_material')).toBe(true)
    expect(appBarComponent.props().position).toBe('static')
    const toolBarComponent = appBar.find(Toolbar)
    expect(toolBarComponent.hasClass('toolbar_material')).toBe(true)
    const iconButtonComponent = appBar.find(IconButton).find('.appBar_menu_button').find('button')
    const iconButtonProps = iconButtonComponent.props()
    expect(typeof iconButtonProps.onClick).toBe('function')
    expect(appBar.find(MenuIcon).hasClass('menuicon_material')).toBe(true)
    const typographyComponent = appBar.find(Typography)
    expect(typographyComponent.hasClass('typography')).toBe(true)
    const typographyProps = typographyComponent.props()
    expect(typographyProps.variant).toBe('title')
    expect(typographyComponent.text()).toContain('Aikavälikertaus')
  })
  it('renders Login button', () => {
    const button = appBar.find(Button)
    const loginButton = button.find('.appBar_login_button')
    const finalButton = loginButton.find('button')
    expect(finalButton.text()).toContain('Login')
  })
  it('Menu button click should call given prop ToggleDrawer', () => {
    const button = appBar.find(IconButton)
    const menuButton = button.find('.appBar_menu_button')
    const finalButton = menuButton.find('button')
    expect(props.toggleDrawer.mock.calls.length).toBe(0)
    finalButton.simulate('click')
    expect(props.toggleDrawer.mock.calls.length).toBe(1)
  })
})