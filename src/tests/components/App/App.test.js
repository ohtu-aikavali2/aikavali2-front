import React from 'react'
import { mount, shallow } from 'enzyme'
import { App } from '../../../app/App'
import FrontPage from '../../../app/components/FrontPage'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'
import AppBar from '../../../app/components/common/AppBar'
import { MemoryRouter } from 'react-router'
import AdminPage from '../../../app/components/Admin'
import LoginPage from '../../../app/components/LoginPage'

describe('<App />', () => {
  let app, props
  beforeAll(() => {
    props = {
      loggedUserInitialization: jest.fn(),
      initializeGame: jest.fn(),
      pauseGame: jest.fn(),
      logout: jest.fn(),
      loggedUser: {
        id: 123,
        token: 12345,
        username: 'Pate1337'
      },
      loadingUser: false,
      ui: {
      }
    }
    app = mount(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}><App {...props} /></Provider>
      </MemoryRouter>
    )
  })
  afterEach(() => {
    props.loggedUserInitialization.mockClear()
    props.initializeGame.mockClear()
    props.pauseGame.mockClear()
    props.logout.mockClear()
  })
  afterAll(() => {
    app.unMount()
  })
  describe('componentWillMount', () => {
    it('calls loggedUserInitialization()', () => {
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
    })
  })
  it('renders self', () => {
    expect(app.find('.App').length).toBe(1)
  })
  it('renders AppBar', () => {
    const appBarComponents = app.find(AppBar)
    expect(appBarComponents.length).toBe(1)
  })
  describe('handleSidebarToggle()', () => {
    it('logout calls logout', () => {
      app.instance().logout()
      expect(props.logout).toHaveBeenCalledTimes(1)
    })

    /* ------------ ROUTES ------------- */

    describe('path \'/\'', () => {
      // FIX TESTS
      /* it('renders FrontPage when loggedUser !== null', () => {
        app = mount(
          <MemoryRouter initialEntries={[ '/' ]}>
            <Provider store={store}><App {...props} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(1)
        expect(app.find(AdminPage).length).toBe(0)
      })
      it('renders FrontPage when loadingUser === true', () => {
        let newProps = { ...props, loggedUser: null, loadingUser: true }
        app = mount(
          <MemoryRouter initialEntries={[ '/' ]}>
            <Provider store={store}><App {...newProps} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(1)
        expect(app.find(AdminPage).length).toBe(0)
      }) */
      it('renders LoginPage when loggedUser === null AND loadingUser === false', () => {
        let newProps = { ...props, loggedUser: null }
        app = mount(
          <MemoryRouter initialEntries={['/']}>
            <Provider store={store}><App {...newProps} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(0)
        expect(app.find(AdminPage).length).toBe(0)
        expect(app.find(LoginPage).length).toBe(1)
      })
    })
    describe('path \'/login\'', () => {
      it('renders LoginPage when loggedUser === null', () => {
        let newProps = { ...props, loggedUser: null }
        app = mount(
          <MemoryRouter initialEntries={['/login']}>
            <Provider store={store}><App {...newProps} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(0)
        expect(app.find(AdminPage).length).toBe(0)
        expect(app.find(LoginPage).length).toBe(1)
      })
      // FIX TESTS
      /* it('renders FrontPage when loggedUser !== null', () => {
        let newProps = { ...props }
        app = mount(
          <MemoryRouter initialEntries={[ '/login' ]}>
            <Provider store={store}><App {...newProps} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(1)
        expect(app.find(AdminPage).length).toBe(0)
        expect(app.find(LoginPage).length).toBe(0)
      }) */
    })
    describe('path \'/admin\'', () => {
      /*it('renders AdminPage when loggedUser !== null', () => {
        app = mount(
          <MemoryRouter initialEntries={[ '/admin' ]}>
            <Provider store={store}><App {...props} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(0)
        expect(app.find(AdminPage).length).toBe(1)
        expect(app.find(LoginPage).length).toBe(0)
      })*/
      it('renders LoginPage when loggedUser === null AND loadingUser === false', () => {
        let newProps = { ...props, loggedUser: null }
        app = mount(
          <MemoryRouter initialEntries={['/admin']}>
            <Provider store={store}><App {...newProps} /></Provider>
          </MemoryRouter>
        )
        expect(app.find(FrontPage).length).toBe(0)
        expect(app.find(AdminPage).length).toBe(0)
        expect(app.find(LoginPage).length).toBe(1)
      })
    })
  })
