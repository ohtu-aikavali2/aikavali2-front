import React from 'react'
import FrontPage from './components/FrontPage'
import AdminPage from './components/Admin'
import AppBar from './components/common/AppBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'
import { pauseGame, initializeGame } from './reducers/actions/gameActions'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends React.Component {

  handleSidebarToggle = async () => {
    if (this.props.ui.drawerOpen) {
      await this.props.initializeGame()
    } else {
      await this.props.pauseGame()
    }
    await this.props.toggleDrawer()
  }
  render () {
    return (
      <div className="App">
        <AppBar toggleDrawer={this.handleSidebarToggle} />
        <TemporaryDrawer toggleDrawer={this.handleSidebarToggle} isOpen={this.props.ui.drawerOpen} />
        <Router>
          <Switch>
            <Route exact path='/' render={() => <FrontPage />} />
            <Route exact path='/admin' render={() => <AdminPage />} />
          </Switch>
        </Router>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  { toggleDrawer, pauseGame, initializeGame }
)(App)

export default ConnectedApp
