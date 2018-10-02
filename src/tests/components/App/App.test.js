import React from 'react'
import { mount } from 'enzyme'
import App from '../../../app/App'
import FrontPage from '../../../app/components/FrontPage'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'
import authService from '../../../app/services/authService'
import AppBar from '../../../app/components/common/AppBar'
import TemporaryDrawer from '../../../app/components/common/TemporaryDrawer'
import ButtonBar from '../../../app/components/common/ButtonBar'
import { MemoryRouter } from 'react-router'
import AdminPage from '../../../app/components/Admin'

describe('<App />', () => {
  let app
  beforeAll(() => {
    app = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <Provider store={store}><App /></Provider>
      </MemoryRouter>
    )
  })
  afterAll(() => {
    app.unMount()
  })
  // Very useless test. Should test the amount of rendered answer options for example.
  it('generates a new user on startup', () => {
    app.update()
    const frontPageComponent = app.find(FrontPage)
    const contentDiv = frontPageComponent.find('.user-info')

    expect(contentDiv.text()).toContain('User id: 123')
    expect(authService.loggedUser.id).toEqual(123)
    expect(authService.loggedUser.token).toEqual(12345)
  })
  it('renders AppBar', () => {
    const appBarComponents = app.find(AppBar)
    expect(appBarComponents.length).toBe(1)
  })
  it('renders TemporaryDrawer', () => {
    const temporaryDrawerComponents = app.find(TemporaryDrawer)
    expect(temporaryDrawerComponents.length).toBe(1)
  })
  it('renders ButtonBar', () => {
    const buttonBarComponents = app.find(ButtonBar)
    expect(buttonBarComponents.length).toBe(1)
  })

  /* ------------ ROUTES ------------- */

  it('path \'/\' renders FrontPage', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <Provider store={store}><App /></Provider>
      </MemoryRouter>
    )
    expect(wrapper.find(FrontPage).length).toBe(1)
    expect(wrapper.find(AdminPage).length).toBe(0)
  })
  it('path \'/admin\' renders AdminPage', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ '/admin' ]}>
        <Provider store={store}><App /></Provider>
      </MemoryRouter>
    )
    expect(wrapper.find(FrontPage).length).toBe(0)
    expect(wrapper.find(AdminPage).length).toBe(1)
  })
})
