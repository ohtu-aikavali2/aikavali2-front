import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
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
import { initializeGame, endGame } from '../../reducers/actions/gameActions'
import './question.css'
import ReviewPopup from '../common/ReviewPopup'
import Loading from '../common/Loading'
import Notifications, { notify } from 'react-notify-toast'
import Button from '@material-ui/core/Button'
import FlagIcon from '@material-ui/icons/Flag'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Zoom from '@material-ui/core/Zoom'
import FillQuestion from './FillQuestion'
import Grid from '@material-ui/core/Grid'
export class Question extends Component {
  constructor() {
    super()
    this.state = {
      selectedList: [],
      startTime: 0,
      pauseStart: 0,
      timer: null,
      showReview: false,
      reviewed: false,
      flagged: false
    }

    this.notificationRef = React.createRef()
  }

  componentDidMount() {
    this.setState({ startTime: Date.now() })
  }

  componentWillReceiveProps(nextProps) {
    const { course } = this.props
    // Peli paussille, paitsi jos kyseessä eka kysymys. (Siitä ei mitata aikaa)
    if (nextProps.game.paused) {
      this.setState({ pauseStart: Date.now() })
    } else if (this.props.game.paused && !nextProps.game.paused && this.state.startTime !== 0) {
      // Paussi päättyi, muutetaan vain startTimea
      this.setState({
        startTime: this.state.startTime + (Date.now() - this.state.pauseStart),
        pauseStart: 0
      })
    }
    if (this.props.loggedUser.loggedUser && !nextProps.loggedUser.loggedUser) {
      // Jos käyttäjä kirjautuu ulos, nollataan kaikki
      clearInterval(this.state.timer)
      this.setState({ selectedList: [], startTime: 0, timer: null })
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
      this.setState({ timer: null, startTime: Date.now(), selectedList: [] })
      this.props.initializeGame()
    }
  }

  componentDidUpdate(prevProps) {
    const { userAnswer } = this.props
    //TODO: handle multiple answers
    if (!prevProps.userAnswer && userAnswer && this.notificationRef.current) {
      if (userAnswer.isCorrect) {
        notify.show('Oikein, hyvä!', 'success', 2000)
      } else if (this.state.selectedList.length > 0 && this.state.selectedList[0].value !== 'Note: questionSkipped') {
        notify.show('Väärin, voi ei!', 'error', 2000)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  getNewQuestion = async () => {
    const { course } = this.props
    if (!this.props.userAnswer) {
      // If the question has not been answered
      this.skipQuestion()
      // Do nothing else
    } else if (this.props.userAnswer && this.state.selectedList.length > 0) {
      this.setState({ selectedList: [], startTime: Date.now(), reviewed: false, flagged: false })
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
  handleSelect = async (id, value) => {
    if (this.props.userAnswer) return
    if (this.state.selectedList.length < 1 || !this.state.selectedList.map(s => s.value).includes(value)) {
      if (this.props.question.item.selectCount === 'selectOne') {
        this.setState({ selectedList: [{ id, value }] })
      } else if (this.props.question.item.selectCount === 'selectMany') {
        this.setState({ selectedList: this.state.selectedList.concat({ id, value }) })
      } else {
        console.log('Error: This question has no selectCount. Please press skip.')
      }
    } else {
      this.setState({
        selectedList: this.state.selectedList.filter(s => s.value !== value)
      })
    }
  }

  handleAnswer = async () => {
    if (this.state.selectedList.length < 1) {
      notify.show('Valitse ainakin yksi vastaus', 'error', 2000)
      return
    }
    let answers = [...this.state.selectedList]
    if (this.props.question.kind === 'FillInTheBlankQuestion') {
      answers = this.state.selectedList.filter(item => item !== undefined)
      this.setState({ selectedList: answers })
    }
    const time = Date.now() - this.state.startTime
    await this.props.answerQuestion(this.props.question.item._id, answers, time)
  }

  handleSelectedList = (i, value) => {
    let copy = [...this.state.selectedList]
    copy[i - 1] = value
    this.setState({
      selectedList: copy
    })
  }

  getSelectedList = () => {
    return this.state.selectedList
  }

  // Tätä kutsutaan painetaan skip ekan kerran
  skipQuestion = async () => {
    // ON tärkeää että setState on ekana, jotta saadaan välittömästi asetettua selected
    this.setState({ selectedList: [{ id: this.props.question.item._id, value: 'Note: questionSkipped' }] })
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

  renderCorrectFillQuestionAnswers = (correctAnswer) => {
    return (
      <React.Fragment>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h4>Oikeat vastaukset</h4>
          {correctAnswer.map((a, i) =>
            <Grid container spacing={24} direction="row" alignItems="center" style={{ paddingBottom: 10 }} key={i}>{i + 1} . {a.map((a, j) => <Grid item key={j}>{a}</Grid>)}</Grid>
          )}
        </div>
      </React.Fragment>
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
        {question && (question.kind === 'PrintQuestion' || question.kind === 'GeneralQuestion') && (
          <PrintQuestion
            question={question.item}
            handleSelect={this.handleSelect}
            selectedList={this.state.selectedList}
            topLeftContent={this.renderReviewText()}
            topRightContent={this.renderFlagButton()}
            answered={!!userAnswer}
            selectCount={this.props.question.item.selectCount}
          />
        )}
        {question && question.kind === 'FillInTheBlankQuestion' && (
          <FillQuestion
            question={question.item}
            topLeftContent={this.renderReviewText()}
            topRightContent={this.renderFlagButton()}
            answered={!!userAnswer}
            getSelectedList={this.getSelectedList}
            handleSelectedList={this.handleSelectedList}
          />
        )}
        {!userAnswer && !loading && (
          <Button style={{ maxWidth: '600px', margin: '0 auto' }} onClick={e => this.handleAnswer(e)} fullWidth variant="contained" color="primary" aria-label="Answer">Vastaa</Button>
        )}
        <ReviewPopup toggle={this.toggleReviewWindow} submit={this.handleQuestionReview} checked={this.state.showReview} timeout={200} />
        <ButtonBar handleSkip={questionMessage === null ? this.getNewQuestion : () => { console.log('skipDisabled') }} showNext={userAnswer !== null} noMoreQuestions={questionMessage !== null} />
        {question && question.kind === 'FillInTheBlankQuestion' && userAnswer && this.renderCorrectFillQuestionAnswers(userAnswer.correctAnswer)}
        <div style={{ width: '100%', height: 70 }} className='offset' />
      </div >
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
  endGame,
  sendReviewForQuestion,
  flagQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
