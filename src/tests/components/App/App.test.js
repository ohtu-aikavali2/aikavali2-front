import React from 'react'
import { mount, shallow } from 'enzyme'
import { App } from '../../../app/App'
import FrontPage from '../../../app/components/FrontPage'
import { Provider } from 'react-redux'
import store from '../../../app/reducers'
import AppBar from '../../../app/components/common/AppBar'
import TemporaryDrawer from '../../../app/components/common/TemporaryDrawer'
import { MemoryRouter } from 'react-router'
import AdminPage from '../../../app/components/Admin'
import LoginPage from '../../../app/components/LoginPage'
/*import configureStore from 'redux-mock-store'

const initialState = {
  ui: {
    drawerOpen: false
  },
  loggedUser: {
    loggedUser: {
      id: 123,
      token: 12345,
      username: 'Pate1337'
    },
    loadingUser: false
  }
}
const mockStore = configureStore()
const store = mockStore(initialState)*/

describe('<App />', () => {
  let app, props
  beforeAll(() => {
    props = {
      loggedUserInitialization: jest.fn(),
      initializeGame: jest.fn(),
      pauseGame: jest.fn(),
      toggleDrawer: jest.fn(),
      logout: jest.fn(),
      loggedUser: {
        id: 123,
        token: 12345,
        username: 'Pate1337'
      },
      loadingUser: false,
      ui: {
        drawerOpen: false
      }
    }
    app = mount(
      <MemoryRouter initialEntries={[ '/' ]}>
        <Provider store={store}><App {...props} /></Provider>
      </MemoryRouter>
    )
  })
  afterEach(() => {
    props.loggedUserInitialization.mockClear()
    props.initializeGame.mockClear()
    props.pauseGame.mockClear()
    props.toggleDrawer.mockClear()
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
  it('renders TemporaryDrawer', () => {
    const temporaryDrawerComponents = app.find(TemporaryDrawer)
    expect(temporaryDrawerComponents.length).toBe(1)
  })
  describe('handleSidebarToggle()', () => {
    it('calls initializeGame AND toggleDrawer when ui.drawerOpen === true (this test uses a 50ms timeout)', () => {
      let newProps = {
        ...props,
        ui: {
          drawerOpen: true
        }
      }
      app = shallow(
        <App {...newProps} />
      )
      app.instance().handleSidebarToggle()
      expect(newProps.initializeGame).toHaveBeenCalledTimes(1)
      expect(newProps.pauseGame).toHaveBeenCalledTimes(0)
      setTimeout(() => {
        expect(newProps.toggleDrawer).toHaveBeenCalledTimes(1)
      }, 50)
    })
    it('calls pauseGame AND toggleDrawer when ui.drawerOpen === false (this test uses a 50ms timeout)', () => {
      app = shallow(
        <App {...props} />
      )
      app.instance().handleSidebarToggle()
      expect(props.pauseGame).toHaveBeenCalledTimes(1)
      expect(props.initializeGame).toHaveBeenCalledTimes(0)
      setTimeout(() => {
        expect(props.toggleDrawer).toHaveBeenCalledTimes(1)
      }, 50)
    })
  })
  it('logout calls logout', () => {
    app.instance().logout()
    expect(props.logout).toHaveBeenCalledTimes(1)
  })

  /* ------------ ROUTES ------------- */

  describe('path \'/\'', () => {
    it('renders FrontPage when loggedUser !== null', () => {
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
    })
    it('renders LoginPage when loggedUser === null AND loadingUser === false', () => {
      let newProps = { ...props, loggedUser: null }
      app = mount(
        <MemoryRouter initialEntries={[ '/' ]}>
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
        <MemoryRouter initialEntries={[ '/login' ]}>
          <Provider store={store}><App {...newProps} /></Provider>
        </MemoryRouter>
      )
      expect(app.find(FrontPage).length).toBe(0)
      expect(app.find(AdminPage).length).toBe(0)
      expect(app.find(LoginPage).length).toBe(1)
    })
    it('renders FrontPage when loggedUser !== null', () => {
      let newProps = { ...props }
      app = mount(
        <MemoryRouter initialEntries={[ '/login' ]}>
          <Provider store={store}><App {...newProps} /></Provider>
        </MemoryRouter>
      )
      expect(app.find(FrontPage).length).toBe(1)
      expect(app.find(AdminPage).length).toBe(0)
      expect(app.find(LoginPage).length).toBe(0)
    })
  })
  describe('path \'/admin\'', () => {
    it('renders AdminPage when loggedUser !== null', () => {
      app = mount(
        <MemoryRouter initialEntries={[ '/admin' ]}>
          <Provider store={store}><App {...props} /></Provider>
        </MemoryRouter>
      )
      expect(app.find(FrontPage).length).toBe(0)
      expect(app.find(AdminPage).length).toBe(1)
      expect(app.find(LoginPage).length).toBe(0)
    })
    it('renders LoginPage when loggedUser === null AND loadingUser === false', () => {
      let newProps = { ...props, loggedUser: null }
      app = mount(
        <MemoryRouter initialEntries={[ '/admin' ]}>
          <Provider store={store}><App {...newProps} /></Provider>
        </MemoryRouter>
      )
      expect(app.find(FrontPage).length).toBe(0)
      expect(app.find(AdminPage).length).toBe(0)
      expect(app.find(LoginPage).length).toBe(1)
    })
  })
})
