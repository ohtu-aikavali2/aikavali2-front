import React from 'react'
import FrontPage from './components/FrontPage'
import AdminPage from './components/Admin'
import AppBar from './components/common/AppBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends React.Component {
  render () {
    return (
      <div className="App">
        <AppBar toggleDrawer={this.props.toggleDrawer} />
        <TemporaryDrawer toggleDrawer={this.props.toggleDrawer} isOpen={this.props.ui.drawerOpen} />
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
  { toggleDrawer }
)(App)

export default ConnectedApp
