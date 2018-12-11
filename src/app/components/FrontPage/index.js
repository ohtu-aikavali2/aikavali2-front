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
    const { course } = this.props
    await this.props.initializeGame()
    await this.props.getRandomQuestion(course)
  }

  async componentWillReceiveProps (nextProps) {
    const { course } = this.props
    if (!nextProps.loggedUser.loggedUser) {
      await this.props.initializeGame()
      await this.props.getRandomQuestion(course)
    }
  }

  render () {
    const { course } = this.props
    return (
      <div className='frontPageContainer' style={{ marginTop: 50 }}>
        <Question course={course} />
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
