import React, { Component } from 'react'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBackward from '@material-ui/icons/ArrowBack'
import DumbQuestion from '../Question/DumbQuestion'
import Steps from 'react-simple-steps'
import Notifications, { notify } from 'react-notify-toast'
import './admin.css'
import {
  postCompileQuestion,
  postPrintQuestion,
  postGeneralQuestion
} from '../../reducers/actions/questionActions'
import { fetchCourses } from '../../reducers/actions/courseActions'
import questionService from '../../services/questionService'
//import conceptService from '../../services/conceptService'
import courseService from '../../services/courseService'
import SimpleDialog from '../common/Dialog'
import { CardActions, IconButton } from '@material-ui/core'
//toistaiseksi tyypit kovakoodattu
const questionTypes = [
  {
    value: 'GeneralQuestion',
    label: 'Yleinen kysymys'
  }
]

let question = {
  kind: '',
  item: { value: '', options: [] }
}

export class QuestionForm extends Component {
  constructor() {
    super()
    this.state = {
      course: '',
      groupId: '',
      questionType: '',
      question: '',
      correctAnswers: [],
      answerOptions: [],
      step: 0,
      courses: [],
      questions: [],
      concepts: [],
      modalOpen: false,
      selectedValue: ''
    }
  }

  async componentDidMount() {
    try {
      await this.props.fetchCourses()

      questionService.getQuestions().then(res => {
        this.setState({
          questions: res
        })
      })
    } catch (e) {
      console.log(e)
      return
    }
  }

  //handles change of questionType, question and correctAnswer in state
  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    })
  }

  //handles modal's open status
  handleClickOpen = () => {
    this.setState({
      modalOpen: true
    })
  }
  //gets the value from modal
  handleClose = value => {
    this.setState({ selectedValue: value, modalOpen: false, question: value })
  }

  addIncorrectAnswer = () => {
    if (this.state.answerOptions.length < 6) {
      this.setState({
        answerOptions: [...this.state.answerOptions, '']
      })
    }
  }

  //handles changes of answerOptions in state
  handleArrayChange = (option, i) => event => {
    let newArray = this.state.answerOptions.slice(0, i)
    newArray.push(event.target.value)
    newArray = newArray.concat(this.state.answerOptions.slice(i + 1))
    this.setState({
      answerOptions: newArray
    })
  }

  removeIncorrectAnswer = (option, i) => event => {
    event.preventDefault()
    if (this.state.answerOptions.length > 1 && !this.state.correctAnswers.includes(option)) {
      let newOptions = this.state.answerOptions
      newOptions.splice(i,1)
      this.setState({
        answerOptions: newOptions
      })
    }
    // if (this.state.answerOptions.length > 1) {
    //   this.setState({
    //     answerOptions: this.state.answerOptions.slice(
    //       0,
    //       this.state.answerOptions.length - 1
    //     )
    //   })
    // }
  }
  //handles checkboxes for correct answers, currently removes the trailing elements if value is changed
  handleCheckForCorrectAnswers (e, x, i) {
    console.log(this.state.correctAnswers)
    if (this.state.correctAnswers.includes(x)) {
      console.log('found')
      const newArray = this.state.correctAnswers.filter(item => item !== x)
      this.setState({
        correctAnswers: newArray
      })
    } else {
      let newArray = this.state.correctAnswers.slice(0, i)
      newArray.push(x)
      newArray = newArray.concat(this.state.correctAnswers.slice(i + 1))
      this.setState({
        correctAnswers: newArray
      })
    }
    // this.setState(state => ({
    //   correctAnswers: state.correctAnswers.includes(x)
    //     ? state.correctAnswers.filter(c => c !== x)
    //     : [...state.correctAnswers, x]
    // }))
    console.log(this.state.correctAnswers)
  }

  handleCheck(e, x) {
    this.setState(state => ({
      concepts: state.concepts.includes(x)
        ? state.concepts.filter(c => c !== x)
        : [...state.concepts, x]
    }))
  }

  handleSelectType(e, x) {
    this.setState(state => ({
      questionType: state.questionType === x ? '' : x
    }))
  }

  determineTypeCardStyle = (type) => {
    return (type === this.state.questionType
      ? {
        background: '#3f51b5',
        textColor: 'white'
      } : {
        background: 'white',
        textColor: 'black'
      }
    )
  }

  determineSelectedCourse = () => {
    const possibleCourses = this.props.courses.filter(obj => {
      return obj.name === this.state.course
    })
    return possibleCourses.length > 0 ? possibleCourses[0] : { groups: [] }
  }

  mapConceptIDsToObjects = () => {
    const selectedCourse = this.determineSelectedCourse()
    return selectedCourse.concepts.filter(c => this.state.concepts.includes(c._id))
  }

  addConceptsToCourses = () => {
    const conceptObjects = this.mapConceptIDsToObjects()
    const selectedCourse = this.determineSelectedCourse()
    const newCourse = {
      ...selectedCourse,
      concepts: conceptObjects
    }
    courseService
      .updateCourse(newCourse, newCourse._id)
      .then(() => {
        this.setState({
          concept: '',
          selectedCourse: newCourse
        })
      })
  }

  handleSave = () => {
    if (this.state.course === '') {
      console.log('Course is not set!')
    } else if (this.state.groupId === '') {
      console.log('Group is not set!')
    } else if (this.state.questionType === '') {
      console.log('Question Type not set!')
    } else if (
      this.state.question === '' &&
      this.state.questionType !== 'CompileQuestion'
    ) {
      console.log('Question is empty!')
    } else if (this.state.correctAnswer === '') {
      console.log('Correct answer is empty')
    } else if (this.state.answerOptions.includes('')) {
      console.log('At least one of incorrect answers are empty')
    } else if (this.state.concepts.length < 1) {
      console.log('Concept is not set!')
    } else {
      // If the question is valid
      this.setState({ step: this.state.step + 1 })
      const concepts = this.mapConceptIDsToObjects()
      if (this.state.questionType === 'PrintQuestion') {
        this.props.postPrintQuestion(
          this.state.groupId,
          this.state.question,
          this.state.correctAnswer,
          this.state.answerOptions,
          concepts
        )
        //this.addConceptsToCourses()
      } else if (this.state.questionType === 'CompileQuestion') {
        this.props.postCompileQuestion(
          this.state.groupId,
          this.state.correctAnswer,
          this.state.answerOptions,
          concepts
        )
        //this.addConceptsToCourses()
      } else {
        this.props.postGeneralQuestion(
          this.state.groupId,
          this.state.question,
          this.state.correctAnswers,
          this.state.answerOptions,
          concepts
        )
        //this.addConceptsToCourses()
      }
      this.setState({
        course: '',
        groupId: '',
        questionType: '',
        question: '',
        correctAnswers: [''],
        answerOptions: [''],
        concepts: []
      })
      console.log('Post succesful')
      notify.show('Kysymys tallennettu', 'success', 2000)
    }
  }

  stepForward = () => {
    if (this.state.step === 0 && this.state.course === '') {
      notify.show('Valitse kurssi', 'error', 2000)
      return
    } else if (this.state.step === 0 && this.state.groupId === '') {
      notify.show('Valitse ryhmä', 'error', 2000)
      return
    } else if (this.state.step === 1 && this.state.questionType === '') {
      notify.show('Valitse kysymystyyppi', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      this.state.questionType === 'PrintQuestion' &&
      this.state.question === ''
    ) {
      notify.show('Kirjoita tulostettava koodi', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      (this.state.correctAnswers.includes('') ||
        this.state.answerOptions.includes(''))
    ) {
      notify.show('Ei saa sisältää tyhjiä vastauksia', 'error', 2000)
      return
    } else if (
      this.state.step === 3 &&
      this.state.concepts.length < 1
    ) {
      notify.show('Valitse ainakin yksi käsite', 'error', 2000)
      return
    }
    this.setState({ step: this.state.step + 1 })
    question.kind = this.state.questionType
    question.item.value = this.state.question
    if (this.state.step > 1) {
      question.item.options = this.state.answerOptions.concat(this.state.correctAnswers)
    }
  }

  render() {
    const { step, questionType } = this.state
    let questionTypeSelected = false
    if (
      questionType === 'PrintQuestion' ||
      questionType === 'GeneralQuestion'
    ) {
      questionTypeSelected = true
    }
    const selectedCourse = this.determineSelectedCourse()

    return (
      <div className="questionFormContainer">
        <Notifications ref={this.notificationRef} />

        <form noValidate autoComplete="off" className="questionForm">
          {step === 4 && <DumbQuestion question={question} />}

          {step === 0 && (
            <React.Fragment>
              <h2>Valitse kurssi</h2>
              <InputLabel style={{ fontSize: 13 }}>Kurssi</InputLabel>
              <Select
                fullWidth
                value={this.state.course}
                onChange={this.handleChange('course')}
                style={{ marginBottom: '10px' }}
              >
                {this.props.courses.map(course => (
                  <MenuItem key={course.name} value={course.name}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
              {this.state.course !== '' ? (
                <div>
                  <InputLabel style={{ fontSize: 13 }}>Ryhmä</InputLabel>
                  <Select
                    fullWidth
                    value={this.state.groupId}
                    onChange={this.handleChange('groupId')}
                  >
                    {selectedCourse.groups.map(group => (
                      <MenuItem key={group._id} value={group._id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              ) : null}
            </React.Fragment>
          )}

          {step === 1 && (
            <React.Fragment>
              <h2>Valitse tyyppi</h2>
              <InputLabel style={{ fontSize: 13 }}>Kysymystyyppi</InputLabel>
              {questionTypes.map(option => {
                const style = this.determineTypeCardStyle(option.value)
                return (
                  <div className='clickbox' key={option.value}>
                    <div className='clickbox-link' onClick={e => this.handleSelectType(e, option.value)}>
                      <Card style={{ background: style.background }} className='clickbox-container'>
                        <CardContent style={{ color: style.textColor }}>
                          {option.label}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              })}
            </React.Fragment>
          )}

          {step === 2 && (
            <React.Fragment>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleClickOpen}
              >
                Valitse kysymys listasta
              </Button>
              <div>
                <SimpleDialog
                  selectedValue={this.state.selectedValue}
                  open={this.state.modalOpen}
                  onClose={this.handleClose}
                  questions={this.state.questions}
                />
              </div>
              {questionTypeSelected ? (
                <TextField
                  label={`${questionType === 'PrintQuestion' ? 'Koodisi' : 'Kysymyksesi'}`}
                  multiline
                  fullWidth
                  rowsMax="6"
                  value={this.state.question}
                  onChange={this.handleChange('question')}
                  className="questionField"
                  helperText={`Kirjoita tähän ${questionType === 'PrintQuestion' ? 'koodisi' : 'kysymyksesi'}`}
                  margin="normal"
                />
              ) : (<h2>Valitse mikä koodeista kääntyy</h2>)}

              {this.state.answerOptions.map((option, i) => (
                <div key={i} className='cardContainer'>
                  <Card>
                    <CardContent>
                      <CardActions style={{ float:'right' }}>
                        <IconButton aria-label="remove" onClick={this.removeIncorrectAnswer(option, i)} >
                          <CloseIcon />
                        </IconButton>
                        {/* <Button onClick={this.removeIncorrectAnswer} variant="fab" mini color="secondary" aria-label="Delete" className='deleteButton'>X</Button> */}
                      </CardActions>
                      <TextField
                        key={i}
                        label="Vastaus"
                        multiline
                        fullWidth
                        rowsMax="6"
                        value={option}
                        onChange={this.handleArrayChange(option, i)}
                        className="wrongAnswerField"
                        helperText="Kirjoita vastausvaihtoehto kysymyksellesi, lisää vaihtoehtoja painamalla '+ Lisää'"
                        margin="normal"
                      />
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              label="Oikea vastaus"
                              onChange={e => this.handleCheckForCorrectAnswers(e, option, i)}
                              checked={this.state.correctAnswers.includes(option)}
                              color='primary'
                            />
                          }
                          label="Oikea vastaus"
                          // key={i}
                        />
                      </FormGroup>
                    </CardContent>
                  </Card>
                </div>
              ))}
              <div className="addButtonContainer">
                <Button onClick={this.addIncorrectAnswer} fullWidth variant="contained" color="primary" aria-label="Add">+ Lisää</Button>
              </div>

            </React.Fragment>
          )}

          {step === 3 && (
            <React.Fragment>
              <h2>Valitse mihin käsitteisiin kysymys liittyy</h2>
              <FormGroup>
                {selectedCourse.concepts.map(concept => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        label={concept.name} key={concept._id}
                        onChange={e => this.handleCheck(e, concept._id)}
                        checked={this.state.concepts.includes(concept._id)}
                        color='primary'
                      />
                    }
                    label={concept.name}
                    key={concept._id}
                  />
                ))}
              </FormGroup>

              {/* <TextField
                label='Uusi konsepti'
                multiline
                fullWidth
                rowsMax='6'
                // value={this.state.concept}
                // onChange={this.handleChange('concept')}
                className='conceptField'
                helperText='Kirjoita kysymykseesi liittyvä konsepti'
                margin='normal'
              />

              <div className='addButtonContainer'>
                <Button variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                  <AddIcon className='addIcon' />
                </Button>
              </div> */}
            </React.Fragment>
          )}
        </form>

        <div className="stepContainer">
          <Steps
            disabled
            current={this.state.step}
            steps={[
              'Valitse kurssi',
              'Valitse tyyppi',
              'Täytä kentät',
              'Valitse konseptit',
              'Tallenna'
            ]}
          />
          <div
            className="stepperButtonContainer"
            style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}
          >
            <div>
              <Button
                disabled={this.state.step < 1 || this.state.step > 4}
                onClick={() => this.setState({ step: this.state.step - 1 })}
                variant="contained"
                className="backwardButton"
              >
                {<ArrowBackward className="backwardIcon" />}
                Takaisin
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                onClick={() => this.props.history.push('/courses')}
                color="primary"
              >
                Etusivu
              </Button>
            </div>
            <div>
              {step < 4 && (
                <Button
                  style={{ float: 'right' }}
                  onClick={() => this.stepForward()}
                  variant="contained"
                  className="forwardButton"
                >
                  Seuraava
                  {<ArrowForward className="forwardIcon" />}
                </Button>
              )}
              {step === 4 && (
                <Button
                  color="primary"
                  onClick={() => this.handleSave()}
                  variant="contained"
                  className="saveButton"
                >
                  Tallenna
                  {<SaveIcon className="saveIcon" />}
                </Button>
              )}
              {step > 4 && (
                <Button
                  onClick={() => this.setState({ step: 0 })}
                  variant="contained"
                  color="primary"
                >
                  Uusi kysymys
                  <AddIcon className="addIcon" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  postCompileQuestion,
  postPrintQuestion,
  postGeneralQuestion,
  fetchCourses
}

const mapStateToProps = state => {
  return {
    courses: state.course.courses
  }
}

const ConnectedQuestionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionForm)

export default ConnectedQuestionForm
