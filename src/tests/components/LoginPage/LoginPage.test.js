import React from 'react'
import { shallow } from 'enzyme'
import { LoginPage } from '../../../app/components/LoginPage'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

describe('<LoginPage />', () => {
  let props, wrapper
  beforeAll(() => {
    props = {
      loggingIn: false,
      error: false,
      login: jest.fn()
    }
    wrapper = shallow(<LoginPage {...props} />)
  })
  it('renders self', () => {
    expect(wrapper.find('.login-page').length).toBe(1)
  })
  it('renders username and password text fields', () => {
    const textFields = wrapper.find(TextField)
    expect(textFields.length).toBe(2)
    expect(textFields.at(0).props().name).toEqual('username')
    expect(textFields.at(1).props().name).toEqual('password')
  })
  it('renders Login button', () => {
    expect(wrapper.find(Button).length).toBe(1)
  })
  it('renders error if there is one', () => {
    wrapper.setState({ error: true })
    wrapper.setProps({ error: 'error occured' })
    const error = wrapper.find('.error')
    expect(error.length).toBe(1)
    expect(error.props().children).toContain('error occured')
  })
  describe('login button', () => {
    it('is disabled when username has not been given', () => {
      wrapper.setState({ username: '' })
      wrapper.setProps({ loggingIn: false })
      expect(wrapper.find(Button).props().disabled).toBe(true)
    })
    it('is disabled when loggingIn', () => {
      wrapper.setState({ username: 'Pate1337' })
      wrapper.setProps({ loggingIn: true })
      expect(wrapper.find(Button).props().disabled).toBe(true)
    })
    it('is enabled when user is not loggingIn and username has been given', () => {
      wrapper.setState({ username: 'Pate1337' })
      wrapper.setProps({ loggingIn: false })
      expect(wrapper.find(Button).props().disabled).toBe(false)
    })
    it('when user is loggingIn shows text "Kirjaudutaan..."', () => {
      wrapper.setProps({ loggingIn: true })
      const button = wrapper.find(Button)
      expect(button.props().children).toContain('Kirjaudutaan...')
    })
    it('when user is not loggingIn shows text "Kirjaudu sisään"', () => {
      wrapper.setProps({ loggingIn: false })
      const button = wrapper.find(Button)
      expect(button.props().children).toContain('Kirjaudu sisään')
    })
  })
  it('componentWillReceiveProps sets password to "" and error to true if props.loggingIn goes from true to false', () => {
    wrapper.setProps({ loggingIn: true })
    wrapper.setState({ error: false, password: 'not empty', username: 'whatever' })
    wrapper.setProps({ loggingIn: false })
    expect(wrapper.state()).toEqual({
      ...wrapper.state(),
      username: 'whatever',
      password: '',
      error: true
    })
  })
  it('handleChange sets correct state', () => {
    wrapper.setState({ error: true })
    wrapper.instance().handleChange({ target: { name: 'username', value: 'TestUserName' } })
    expect(wrapper.state()).toEqual({
      ...wrapper.state(),
      error: false,
      username: 'TestUserName'
    })
  })
  it('handleLogin calls props.login with correct parameters', () => {
    wrapper.setState({ username: 'username', password: 'password' })
    const mockPrevent = jest.fn()
    wrapper.instance().handleLogin({ preventDefault: mockPrevent })
    expect(mockPrevent).toHaveBeenCalledTimes(1)
    expect(props.login).toHaveBeenCalledWith('username', 'password')
    props.login.mockClear()
  })
  it('typing text to username textfield changes the value in the state', () => {
    wrapper.setState({ username: '' })
    const nameField = wrapper.find(TextField).at(0)
    nameField.simulate('change', { target: { name: 'username', value: 'Pate1337' } })
    expect(wrapper.state().username).toEqual('Pate1337')
  })
  it('typing text to password textfield changes the value in the state', () => {
    wrapper.setState({ password: '' })
    const passwordField = wrapper.find(TextField).at(0)
    passwordField.simulate('change', { target: { name: 'password', value: 'salasana' } })
    expect(wrapper.state().password).toEqual('salasana')
  })
  it('submitting form calls props.login', () => {
    props.login.mockClear()
    expect(props.login).toHaveBeenCalledTimes(0)
    wrapper.setState({ username: 'Pate1337', password: 'salasana', error: false })
    wrapper.setProps({ loggingIn: false })
    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault: jest.fn() })
    expect(props.login).toHaveBeenCalledTimes(1)
    expect(props.login).toHaveBeenCalledWith('Pate1337', 'salasana')
    props.login.mockClear()
  })
  // Some occasions could be tested here. For example if user does not type username => error is shown (needs mounting)
})
