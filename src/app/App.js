import React from 'react'
import FrontPage from './components/FrontPage'
import AdminPage from './components/Admin'
import CoursePage from './components/CoursePage'
import AppBar from './components/common/AppBar'
import LoginPage from './components/LoginPage'
import ConnectedQuestionForm from './components/Admin/QuestionForm'
import IntroScreen from './components/common/IntroScreen'
import Questions from './components/Admin/Questions'
import Courses from './components/Admin/Courses'
import Concepts from './components/Admin/Concepts'
import { connect } from 'react-redux'
import { logout, loggedUserInitialization } from './reducers/actions/authActions'
import { pauseGame, initializeGame } from './reducers/actions/gameActions'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import Loading from './components/common/Loading'

export class App extends React.Component {
  componentWillMount = async () => await this.props.loggedUserInitialization()

  logout = () => this.props.logout()

  render() {
    const { loggedUser, loadingUser } = this.props
    if (loadingUser) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Loading />
        </div>
      )
    }
    return (
      <div className="App">
        <IntroScreen />
        <Router>
          <React.Fragment>
            <Route path='/' render={({ history }) => <AppBar user={loggedUser} logout={this.logout} history={history} />} />
            <Switch>
              <ProtectedRoute
                path='/admin'
                redirectTo='/'
                pred={loggedUser && loggedUser.administrator}
              >
                <Route
                  path='/admin'
                  render={({ history }) => <AdminPage history={history} />}
                />
                <Switch>
                  <Route
                    exact path='/admin/newquestion'
                    render={({ history }) => <ConnectedQuestionForm history={history} />}
                  />
                  <Route
                    exact path='/admin/flags'
                    render={() => <Questions flagged />}
                  />
                  <Route
                    exact path='/admin/deleted'
                    render={() => <Questions deleted />}
                  />
                  <Route
                    exact path='/admin/questions'
                    render={() => <Questions available />}
                  />
                  <Route
                    exact path='/admin/courses'
                    render={() => <Courses />}
                  />
                  <Route
                    exact path='/admin/concepts'
                    render={() => <Concepts />}
                  />
                </Switch>
              </ProtectedRoute>
              <ProtectedRoute exact path='/login' render={() => <LoginPage />} redirectTo='/' pred={(loggedUser === null)} />
              <ProtectedRoute path='/' redirectTo='/login' pred={(loggedUser !== null || loadingUser)}>
                <Route exact path='/' render={() => <Redirect to='/courses' />} />
                <Route exact path='/courses' render={({ history }) => <CoursePage history={history} />} />
                <Route exact path='/courses/:name' render={({ match }) => <FrontPage course={match.params.name} />} />
                <Route
                  exact path='/newquestion'
                  render={({ history }) => <ConnectedQuestionForm history={history} />}
                />
              </ProtectedRoute>
            </Switch>
          </React.Fragment>
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
  { pauseGame, initializeGame, logout, loggedUserInitialization }
)(App)

export default ConnectedApp
