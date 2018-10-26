import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'
import ButtonBar from '../common/ButtonBar'
import AlertWindow from '../common/AlertWindow'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { getRandomQuestion, answerQuestion, sendReviewForQuestion } from '../../reducers/actions/questionActions'
import { initializeGame, endGame, startGame } from '../../reducers/actions/gameActions'
import './question.css'
import ReviewPopup from '../common/ReviewPopup'

export class Question extends Component {
  constructor () {
    super()
    this.state = {
      selected: null,
      startTime: 0,
      pauseStart: 0,
      timer: null,
      showReview: false,
      reviewed: false
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
        pauseStart: 0
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
      this.setState({ selected: null, startTime: Date.now(), reviewed: false })
    }
  }

  handleQuestionReview = async (question, review) => {
    this.setState({ reviewed: true, showReview: false })
    await this.props.sendReviewForQuestion(this.state.selected.id, review)
  }

  handleAnswer = async (id, value) => {
    if (this.state.selected && !this.props.userAnswer) {
      console.log('cant press now lol')
    } else {
      this.setState({ selected: { id, value } })
      const time = this.state.startTime !== 0 ? Date.now() - this.state.startTime : 0
      await this.props.answerQuestion(id, value, time)
    }
  }

  skipQuestion = async () => {
    // Lähetetään vastaus, jossa value = 'Note: questionSkipped'
    await this.props.answerQuestion(this.props.question.item._id, 'Note: questionSkipped', null)
    this.setState({ selected: null })
  }

  toggleReviewWindow = () => {
    this.setState({ showReview: !this.state.showReview })
  }

  render() {
    const text = {
      fontSize: 16
    }
    const { question, userAnswer, questionMessage } = this.props
    return (
      <div className='questionContainer'>
        {questionMessage && (
          <AlertWindow title={questionMessage} neutral>
            <Typography style={text} component="p">Uusia kysymykset saatavilla myöhemmin</Typography>
          </AlertWindow>
        )}
        {question && question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} handleQuestionReview={this.handleQuestionReview} handleSelect={this.handleAnswer} handleSkip={this.getNewQuestion} selected={this.state.selected} />}
        {question && question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} handleQuestionReview={this.handleQuestionReview} handleSelect={this.handleAnswer} handleSkip={this.getNewQuestion} selected={this.state.selected} />}
        {userAnswer && (
          <div style={{ textAlign: 'center' }}>
            {!this.state.reviewed
              ? <p style={{ cursor: 'pointer', color: 'blue' }} onClick={this.toggleReviewWindow}>Oliko kysymys mielestäsi hyvä? - Arvostele</p>
              : <p>Kiitos palautteesta!</p>
            }
          </div>
        )}
        {this.state.showReview && <ReviewPopup toggle={this.toggleReviewWindow} submit={this.handleQuestionReview} />}
        <ButtonBar handleSkip={this.getNewQuestion} showNext={userAnswer !== null} noMoreQuestions={questionMessage !== null} />
        <div style={{ width: '100%', height: 70 }} className='offset' />
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
  endGame,
  sendReviewForQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
