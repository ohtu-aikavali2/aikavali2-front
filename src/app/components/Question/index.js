import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'
import ButtonBar from '../common/ButtonBar'
import AlertWindow from '../common/AlertWindow'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import {
  getRandomQuestion,
  answerQuestion,
  sendReviewForQuestion,
  flagQuestion
} from '../../reducers/actions/questionActions'
import { initializeGame, endGame, startGame } from '../../reducers/actions/gameActions'
import './question.css'
import ReviewPopup from '../common/ReviewPopup'
import Loading from '../common/Loading'
import Notifications, { notify } from 'react-notify-toast'
import Button from '@material-ui/core/Button'
import FlagIcon from '@material-ui/icons/Flag'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Zoom from '@material-ui/core/Zoom'

export class Question extends Component {
  constructor () {
    super()
    this.state = {
      selected: null,
      startTime: 0,
      pauseStart: 0,
      timer: null,
      showReview: false,
      reviewed: false,
      flagged: false
    }

    this.notificationRef = React.createRef()
  }

  componentWillReceiveProps (nextProps) {
    const { course } = this.props
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
      const timer = setInterval(() => this.props.getRandomQuestion(course), 2000)
      this.setState({ timer })
    } else if (!nextProps.questionMessage && nextProps.game.ended) {
      // intervalli lopetetaan kun message on poissa ja ended = totta.
      clearInterval(this.state.timer)
      this.setState({ timer: null, startTime: 0, selected: null })
      this.props.initializeGame()
    }
  }

  componentDidUpdate(prevProps) {
    const { userAnswer } = this.props
    if (!prevProps.userAnswer && userAnswer && this.notificationRef.current) {
      if (userAnswer.isCorrect) {
        notify.show('Oikein, hyvä!', 'success', 2000)
      } else if (this.state.selected.value !== 'Note: questionSkipped') {
        notify.show('Väärin, voi ei!', 'error', 2000)
      }
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.timer)
  }

  getNewQuestion = async () => {
    const { course } = this.props
    if (!this.props.userAnswer && !this.state.selected) {
      // If the question has not been answered
      this.skipQuestion()
      // Do nothing else
    } else if (this.props.userAnswer && this.state.selected) {
      this.setState({ selected: null, startTime: Date.now(), reviewed: false, flagged: false })
      await this.props.getRandomQuestion(course)
    } else {
      console.log('Ei voi painaa nyt!')
    }
  }

  handleQuestionReview = async (question, review) => {
    this.setState({ reviewed: true, showReview: false })
    // NOTE: this uses the question._id INSTEAD of question.item._id
    await this.props.sendReviewForQuestion(this.props.question._id, review)
  }

  // Ensimmäinen painallus kysymysvaihtoehtoon
  handleAnswer = async (id, value) => {
    if (!(this.state.selected && !this.props.userAnswer)) {
      this.setState({ selected: { id, value } })
      const time = this.state.startTime !== 0 ? Date.now() - this.state.startTime : 0
      await this.props.answerQuestion(id, value, time)
    }
  }

  // Tätä kutsutaan painetaan skip ekan kerran
  skipQuestion = async () => {
    // ON tärkeää että setState on ekana, jotta saadaan välittömästi asetettua selected
    this.setState({ selected: { id: this.props.question.item._id, value: 'Note: questionSkipped' } })
    // Lähetetään vastaus, jossa value = 'Note: questionSkipped'
    await this.props.answerQuestion(this.props.question.item._id, 'Note: questionSkipped', null)
  }

  toggleReviewWindow = () => {
    this.setState({ showReview: !this.state.showReview })
  }
  handleFlag = async () => {
    this.setState({ flagged: true })
    // NOTE: this uses the question._id INSTEAD of question.item._id
    await this.props.flagQuestion(this.props.question._id)
  }
  renderReviewText = () => {
    return (
      <div>
        {!this.state.reviewed
          ? (
            <Button size='small' onClick={this.toggleReviewWindow} color='primary'>
              Arvostele
            </Button>
          )
          : (
            <Zoom in={true}>
              <div style={{ color: 'rgb(113, 218, 113)', alignItems: 'center', justifyContent: 'center', display: 'flex', fontSize: 12 }}>
                <CheckCircle style={{ marginRight: 5 }} />
                Kiitos palautteesta!
              </div>
            </Zoom>
          )
        }
      </div>
    )
  }
  renderFlagButton = () => {
    return (
      <div>
        {!this.state.flagged
          ? (
            <Button size='small' color='secondary' onClick={this.handleFlag}>
              Ilmianna
              <FlagIcon style={{ marginLeft: 5 }} />
            </Button>
          )
          : (
            <Zoom in={true}>
              <div style={{ color: 'rgb(113, 218, 113)', alignItems: 'center', justifyContent: 'center', display: 'flex', fontSize: 12 }}>
                <CheckCircle style={{ marginRight: 5 }} />
                Ilmiannettu!
              </div>
            </Zoom>
          )
        }
      </div>
    )
  }

  render() {
    const text = {
      fontSize: 16
    }
    const { question, userAnswer, questionMessage, loading } = this.props
    return (
      <div className='questionContainer'>
        <Notifications ref={this.notificationRef} />
        {questionMessage && (
          <AlertWindow title={questionMessage} neutral>
            <Typography style={text} component="p">Uusia kysymyksiä saatavilla myöhemmin</Typography>
            <a href="https://goo.gl/forms/GGU02CHM2bZcShhy2" target="_blank" rel="noopener noreferrer">Anna palautetta</a>
          </AlertWindow>
        )}
        {loading && <Loading />}
        {question && question.kind === 'PrintQuestion' && (
          <PrintQuestion
            question={question.item}
            handleQuestionReview={this.handleQuestionReview}
            handleSelect={this.handleAnswer}
            handleSkip={this.getNewQuestion}
            selected={this.state.selected}
            topLeftContent={this.renderReviewText()}
            topRightContent={this.renderFlagButton()}
            answered={!!userAnswer}
          />
        )}
        {question && question.kind === 'CompileQuestion' && (
          <CompileQuestion
            question={question.item}
            handleQuestionReview={this.handleQuestionReview}
            handleSelect={this.handleAnswer}
            handleSkip={this.getNewQuestion}
            selected={this.state.selected}
            topLeftContent={this.renderReviewText()}
            topRightContent={this.renderFlagButton()}
            answered={!!userAnswer}
          />
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
    loggedUser: state.loggedUser,
    loading: state.question.loading,
    answering: state.question.answering
  }
}

const mapDispatchToProps = {
  getRandomQuestion,
  answerQuestion,
  initializeGame,
  startGame,
  endGame,
  sendReviewForQuestion,
  flagQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
