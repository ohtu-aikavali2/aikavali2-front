import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'
import ButtonBar from '../common/ButtonBar'
import AlertWindow from '../common/AlertWindow'
import { connect } from 'react-redux'
import { getRandomQuestion, answerQuestion } from '../../reducers/actions/questionActions'
import { initializeGame, endGame, startGame } from '../../reducers/actions/gameActions'

export class Question extends Component {
  constructor () {
    super()
    this.state = {
      selected: null,
      startTime: 0,
      pauseStart: 0,
      timer: null
    }
  }

  componentWillReceiveProps (nextProps) {
    // Peli paussille, paitsi jos kyseessä eka kysymys. (Siitä ei mitata aikaa)
    if (nextProps.game.paused && this.state.startTime !== 0) {
      this.setState({ pauseStart: Date.now() })
    } else if (this.props.game.paused && !nextProps.game.paused && this.state.startTime !== 0) {
      // Paussi päättyi, muutetaan vain startTimea
      this.setState({
        startTime: this.state.startTime + (Date.now() - this.state.pauseStart),
        pauseStart: null
      })
    }
    if (!nextProps.loggedUser.loggedUser) {
      // Jos käyttäjä kirjautuu ulos, nollataan kaikki
      clearInterval(this.state.timer)
      this.setState({ selected: null, startTime: 0, timer: null })
    } else if (nextProps.questionMessage && !nextProps.game.ended) {
      // Kysymykset loppuneet. nexProps.game.ended = false, koska seuraavassa vasta asetetaan
      this.props.endGame()
    } else if (nextProps.game.ended && !this.state.timer) {
      // aloitetaan intervalli
      const timer = setInterval(this.props.getRandomQuestion, 2000)
      this.setState({ timer })
    } else if (!nextProps.questionMessage && nextProps.game.ended) {
      // intervalli lopetetaan kun message on poissa ja ended = totta.
      clearInterval(this.state.timer)
      this.setState({ timer: null, startTime: 0, selected: null })
      this.props.initializeGame()
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.timer)
  }

  getNewQuestion = async () => {
    if (!this.props.userAnswer) {
      // If the question has not been answered
      this.skipQuestion()
      // Do nothing else
    } else {
      await this.props.getRandomQuestion()
      // setState() after async function, so that new question is
      // rendered (almost) at the same time that option selections are removed
      // Asetetaan myös startTime
      this.setState({ selected: null, startTime: Date.now() })
    }
  }

  handleConfirm = async () => {
    const { selected } = this.state
    if (selected) {
      // Otetaan talteen vastauaika, joka lähetetään backendiin
      const time = this.state.startTime !== 0 ? Date.now() - this.state.startTime : 0
      await this.props.answerQuestion(selected.id, selected.value, time)
    }
  }

  selectOption = (id, value) => {
    this.setState({ selected: { id, value } })
  }

  skipQuestion = async () => {
    // Lähetetään vastaus, jossa value = 'Note: questionSkipped'
    await this.props.answerQuestion(this.props.question.item._id, 'Note: questionSkipped', null)
    this.setState({ selected: null })
  }

  render() {
    const { question, userAnswer, questionMessage } = this.props
    return (
      <div className='questionContainer'>
        {questionMessage && (
          <AlertWindow title={questionMessage} neutral>
            <p>New questions will be available soon, all you need to do is wait a few seconds</p>
          </AlertWindow>
        )}
        {question && question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} handleSelect={this.selectOption} handleConfirm={this.handleConfirm} selected={this.state.selected} />}
        {question && question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} handleSelect={this.selectOption} handleConfirm={this.handleConfirm} selected={this.state.selected} />}
        <ButtonBar handleSkip={this.getNewQuestion} showNext={userAnswer !== null} noMoreQuestions={questionMessage !== null} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer,
    question: state.question.question,
    questionMessage: state.question.message,
    game: state.game,
    loggedUser: state.loggedUser
  }
}
const mapDispatchToProps = {
  getRandomQuestion,
  answerQuestion,
  initializeGame,
  startGame,
  endGame
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
