import React from 'react'
import { mount } from 'enzyme'
import App from '../../../app/App'
import FrontPage from '../../../app/components/FrontPage'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'
import authService from '../../../app/services/authService'
import AppBar from '../../../app/components/common/AppBar'

describe('<App />', () => {
  let app
  beforeAll(() => {
    app = mount(<Provider store={store}><App /></Provider>)
  })
  // Very useless test. Should test the amount of rendered answer options for example.
  it('generates a new user on startup', () => {
    app.update()
    const frontPageComponent = app.find(FrontPage)
    const contentDiv = frontPageComponent.find('.user-info')

    expect(contentDiv.text()).toContain('User id: 123')
    expect(authService.user.id).toEqual(123)
    expect(authService.user.token).toEqual(null)
  })
  it('renders AppBar', () => {
    const appBarComponents = app.find(AppBar)
    expect(appBarComponents.length).toBe(1)
  })
})
