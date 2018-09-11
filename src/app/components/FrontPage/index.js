import React, { Component } from 'react'
import ExampleCalculator from './ExampleCalculator'
import { connect } from 'react-redux'
import { exampleIncrement } from '../../reducers/actions/exampleActions'
import './frontPage.css'
import { loggedUserInitialization, logout } from '../../reducers/actions/authActions'

class FrontPage extends Component {

  async componentDidMount () {
    await this.props.loggedUserInitialization()
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
      <div>
        <h1>Aikavälikertaus</h1>
        {user
          ? (
            <div className="user-info">
              <p>User id: {user.id}, User token: {user.token}</p>
              {!user.token ? <p>Käyttäjä ei ole rekisteröitynyt (Jos käyttäjällä token, on rekisteröitynyt)</p> : <p>Käyttäjä on rekisteröitynyt</p>}
            </div>
          )
          : <p>Ei käyttäjää, refreshaa sivu generoidaksesi uuden käyttäjän</p>
        }
        <ExampleCalculator currentValue={this.props.example.currentValue} handleClick={this.props.exampleIncrement} />
        <button onClick={this.props.logout}>Tyhjennä localStorage</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    example: state.example,
    loggedUser: state.loggedUser
  }
}
const mapDispatchToProps = {
  loggedUserInitialization,
  exampleIncrement,
  logout
}

const ConnectedFrontPage = connect(mapStateToProps, mapDispatchToProps)(FrontPage)

export default ConnectedFrontPage
