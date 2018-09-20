import React from 'react'
import FrontPage from './components/FrontPage'
import AppBar from './components/common/AppBar'
import ButtonBar from './components/common/ButtonBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'

class App extends React.Component {
  render () {
    return (
      <div className="App">
        <AppBar toggleDrawer={this.props.toggleDrawer} />
        <TemporaryDrawer toggleDrawer={this.props.toggleDrawer} isOpen={this.props.ui.drawerOpen} />
        <FrontPage />
        <ButtonBar/>
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
