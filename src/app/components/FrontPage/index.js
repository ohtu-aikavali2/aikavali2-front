import React, { Component } from 'react'
import ExampleCalculator from './ExampleCalculator'
import { connect } from 'react-redux'
import { exampleIncrement, getExample } from '../../reducers/actions/exampleActions'
import './frontPage.css'
import { loggedUserInitialization, logout } from '../../reducers/actions/authActions'
import { getRandomQuestion } from '../../reducers/actions/questionActions'
import Question from '../Question'
import ButtonBar from '../common/ButtonBar'

class FrontPage extends Component {

  async componentDidMount () {
    await this.props.loggedUserInitialization()
    this.getNewQuestion()
  }

  async componentWillReceiveProps (nextProps) {
    if (!nextProps.loggedUser.loggedUser) {
      // If user logs out, a new "unregistered" user is created, so user will get
      // "fresh/new" questions. This is also null ONLY if user logs out.
      await this.props.loggedUserInitialization()
    }
  }

  getNewQuestion = () => {
    this.props.getRandomQuestion()
  }
  handleConfirm = () => {
    console.log('Confirm pressed')
  }

  render () {
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
        <ExampleCalculator currentValue={this.props.example.currentValue} handleClick={this.props.exampleIncrement} />
        <button onClick={this.props.logout}>Tyhjennä localStorage</button>
        {this.props.question && <Question question={this.props.question} />}
        <ButtonBar handleSkip={this.getNewQuestion} handleConfirm={this.handleConfirm} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    example: state.example,
    loggedUser: state.loggedUser,
    question: state.question.question
  }
}
const mapDispatchToProps = {
  loggedUserInitialization,
  exampleIncrement,
  logout,
  getExample,
  getRandomQuestion
}

const ConnectedFrontPage = connect(mapStateToProps, mapDispatchToProps)(FrontPage)

export default ConnectedFrontPage
