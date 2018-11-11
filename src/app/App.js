import React from 'react'
import FrontPage from './components/FrontPage'
import AdminPage from './components/Admin'
import CoursePage from './components/CoursePage'
import AppBar from './components/common/AppBar'
import TemporaryDrawer from './components/common/TemporaryDrawer'
import LoginPage from './components/LoginPage'
import ConnectedQuestionForm from './components/Admin/QuestionForm'
import FlaggedQuestions from './components/Admin/FlaggedQuestions'
import { connect } from 'react-redux'
import { toggleDrawer } from './reducers/actions/uiActions'
import { logout, loggedUserInitialization } from './reducers/actions/authActions'
import { pauseGame, initializeGame } from './reducers/actions/gameActions'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import FlaggedQuestionsTable from './components/Admin/FlaggedQuestionsTable'

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

  render() {
    const { loggedUser, loadingUser } = this.props
    return (
      <div className="App">
        <AppBar toggleDrawer={this.handleSidebarToggle} user={this.props.loggedUser} logout={this.logout} />
        <TemporaryDrawer toggleDrawer={this.handleSidebarToggle} isOpen={this.props.ui.drawerOpen} />
        <Router>
          <Switch>
            <ProtectedRoute exact path='/login' render={() => <LoginPage />} redirectTo='/' pred={(loggedUser === null)} />
            <ProtectedRoute path='/' redirectTo='/login' pred={(loggedUser !== null || loadingUser)}>
              <Route exact path='/' render={() => <Redirect to='/courses' />} />
              <Route exact path='/courses' render={({ history }) => <CoursePage history={history} />} />
              <Route exact path='/courses/:name' render={({ match }) => <FrontPage course={match.params.name} />} />
              <ProtectedRoute
                path='/admin'
                redirectTo='/'
                render={({history}) => <AdminPage history={history} />}
                pred={loggedUser && loggedUser.administrator}
              />
              <Route
                exact path='/admin/newquestion'
                render={({ history }) => <ConnectedQuestionForm history={history} />}
              />
              <Route
                exact path='/admin/flags'
                render={({ history }) => <FlaggedQuestions history={history} />}
              />
              <Route
                exact path='/admin/flags/courses'
                render={({ history }) => <CoursePage history={history} />}
              />
              <Route
                exact path='/admin/flags/courses/:name'
                render={({ history }) => <FlaggedQuestionsTable history={history} />}
              />
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
