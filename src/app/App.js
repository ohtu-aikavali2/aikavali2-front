import React from 'react'
import FrontPage from './components/FrontPage'
import AdminPage from './components/Admin'
import AppBar from './components/common/AppBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import LoginPage from './components/LoginPage'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'
import { logout, loggedUserInitialization } from './reducers/actions/authActions'
import { pauseGame, initializeGame } from './reducers/actions/gameActions'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'

export class App extends React.Component {
  componentWillMount = async () => await this.props.loggedUserInitialization()

  handleSidebarToggle = async () => {
    if (this.props.ui.drawerOpen) {
      await this.props.initializeGame()
    } else {
      await this.props.pauseGame()
    }
    await this.props.toggleDrawer()
  }

  logout = () => this.props.logout()

  render () {
    const { loggedUser, loadingUser } = this.props
    return (
      <div className="App">
        <AppBar toggleDrawer={this.handleSidebarToggle} user={this.props.loggedUser} logout={this.logout} />
        <TemporaryDrawer toggleDrawer={this.handleSidebarToggle} isOpen={this.props.ui.drawerOpen} />
        <Router>
          <Switch>
            <ProtectedRoute exact path='/login' render={() => <LoginPage />} redirectTo='/' pred={(loggedUser === null)}/>
            <ProtectedRoute path='/' redirectTo='/login' pred={(loggedUser !== null || loadingUser)}>
              <Route exact path='/' render={() => <FrontPage />} />
              <ProtectedRoute
                exact path='/admin'
                redirectTo='/'
                render={() => <AdminPage />}
                pred={loggedUser && loggedUser.administrator}
              />
              <Route exact path='/admin' render={() => <AdminPage />} />
            </ProtectedRoute>
          </Switch>
        </Router>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    loggedUser: state.loggedUser.loggedUser,
    loadingUser: state.loggedUser.loadingUser
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  { toggleDrawer, pauseGame, initializeGame, logout, loggedUserInitialization }
)(App)

export default ConnectedApp
