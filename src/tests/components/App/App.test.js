import React from 'react'
import { mount } from 'enzyme'
import App from '../../../app/App'
import FrontPage from '../../../app/components/FrontPage'
jest.mock('../../../app/services/authService')
import { Provider } from 'react-redux'
import store from '../../../app/reducers'
import authService from '../../../app/services/authService'

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
})
