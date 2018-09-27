import React from 'react'
import FrontPage from './components/FrontPage'
import AppBar from './components/common/AppBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import windowSize from 'react-window-size'

class App extends React.Component {
  render () {
    console.log(this.props.windowWidth)
    return (
      <div className="App" style={{ width: this.props.windowWidth, height: '100%', border: 'solid', borderColor: 'red' }}>
        <AppBar toggleDrawer={this.props.toggleDrawer} />
        <TemporaryDrawer toggleDrawer={this.props.toggleDrawer} isOpen={this.props.ui.drawerOpen} />
        <Router>
          <Switch>
            <Route exact path='/' render={() => <FrontPage />} />
            <Route exact path='/admin' render={() => <p>helloworld</p>} />
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

export default windowSize(ConnectedApp)
