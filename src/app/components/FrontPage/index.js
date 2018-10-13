import React, { Component } from 'react'
import { connect } from 'react-redux'
import './frontPage.css'
import { logout, loggedUserInitialization } from '../../reducers/actions/authActions'
import { getRandomQuestion } from '../../reducers/actions/questionActions'
import { initializeGame } from '../../reducers/actions/gameActions'
import Question from '../Question'

// exported for tests
export class FrontPage extends Component {

  async componentDidMount () {
    await this.props.initializeGame()
    await this.props.getRandomQuestion()
  }

  async componentWillReceiveProps (nextProps) {
    if (!nextProps.loggedUser.loggedUser) {
      await this.props.initializeGame()
      await this.props.getRandomQuestion()
    }
  }

  render () {
    const user = this.props.loggedUser.loggedUser
    return (
      <div className='frontPageContainer' style={{ marginTop: 50 }}>
        {false && user &&
          (
            <div className="user-info">
              <p>User id: {user.id}, User token: {false && user.token}</p>
              {!user.token ? <p>Käyttäjä ei ole rekisteröitynyt (Jos käyttäjällä token, on rekisteröitynyt)</p> : <p>Käyttäjä on rekisteröitynyt</p>}
            </div>
          )
        }
        <Question />
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
  getRandomQuestion,
  initializeGame
}

const ConnectedFrontPage = connect(mapStateToProps, mapDispatchToProps)(FrontPage)

export default ConnectedFrontPage
