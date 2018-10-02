import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loggedUserInitialization, logout } from '../../reducers/actions/authActions'
import QuestionForm from './QuestionForm'

class AdminPage extends Component {

  async componentDidMount() {
    await this.props.loggedUserInitialization()
  }

  async componentWillReceiveProps(nextProps) {
    if (!nextProps.loggedUser.loggedUser) {
      await this.props.loggedUserInitialization()
    }
  }

  render() {
    const user = this.props.loggedUser.loggedUser
    return (
      <div>
        {user
          ? (
            <div className="user-info">
              <p>User id: {user.id}, User token: {false && user.token}</p>
              {!user.token ? <p>Käyttäjä ei ole rekisteröitynyt (Jos käyttäjällä token, on rekisteröitynyt)</p> : <p>Käyttäjä on rekisteröitynyt</p>}
            </div>
          )
          : <p>Ei käyttäjää, refreshaa sivu generoidaksesi uuden käyttäjän</p>
        }
        <button onClick={this.props.logout}>Tyhjennä localStorage</button>
        <h1>Admin page</h1>
        <QuestionForm />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.loggedUser
  }
}

const mapDispatchToProps = {
  loggedUserInitialization,
  logout
}

const ConnectedAdminPage = connect(mapStateToProps, mapDispatchToProps)(AdminPage)

export default ConnectedAdminPage