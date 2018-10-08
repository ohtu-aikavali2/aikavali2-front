import React, { Component } from 'react'
import { connect } from 'react-redux'
import './frontPage.css'
import { loggedUserInitialization, logout } from '../../reducers/actions/authActions'
import { getRandomQuestion } from '../../reducers/actions/questionActions'
import Question from '../Question'
import ButtonBar from '../common/ButtonBar'

// exported for tests
export class FrontPage extends Component {

  async componentDidMount () {
    await this.props.loggedUserInitialization()
    await this.props.getRandomQuestion()
  }

  async componentWillReceiveProps (nextProps) {
    if (!nextProps.loggedUser.loggedUser) {
      // If user logs out, a new "unregistered" user is created, so user will get
      // "fresh/new" questions. This is also null ONLY if user logs out.
      await this.props.loggedUserInitialization()
    }
  }

  render () {
    const user = this.props.loggedUser.loggedUser
    return (
      <div className='frontPageContainer'>
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
        <Question />
        {false && <ButtonBar handleSkip={this.getNewQuestion} handleConfirm={this.handleConfirm} />}
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
  logout,
  getRandomQuestion
}

const ConnectedFrontPage = connect(mapStateToProps, mapDispatchToProps)(FrontPage)

export default ConnectedFrontPage
