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
import conceptService from '../../services/conceptService'
import courseService from '../../services/courseService'
import SimpleDialog from '../common/Dialog'
import { CardActions, IconButton, FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core'
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
      newConcept: '',
      questionType: '',
      question: '',
      correctAnswers: [],
      answerOptions: [],
      step: 0,
      courses: [],
      questions: [],
      concepts: [], // checked concepts: holds the id's of existing concepts of selected course and the names of new concepts
      newConcepts: [],
      modalOpen: false,
      selectedValue: '',
      selectedValueForRadioButton: ''
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
    this.setState({
      selectedValue: value,
      modalOpen: false,
      question: value
    })
  }

  addAnswerOption = () => {
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
    if (this.state.answerOptions.includes(event.target.value)) {
      notify.show('Vastausvaihto on jo luotu', 'error', 2000)
    }
    this.setState({
      answerOptions: newArray
    })
  }

  // removes incorrect answer and rearranges the card ids for correct answers
  removeIncorrectAnswer = (option, i) => event => {
    event.preventDefault()
    if (this.state.answerOptions.length > 1 && !this.state.correctAnswers.map(e => e.value).includes(option)) {
      let newOptions = this.state.answerOptions
      newOptions.splice(i, 1)
      let reOrderCorrectAnswers = this.state.correctAnswers.map(item => {
        let temp = Object.assign({}, item)
        if (temp.cardId > i) {
          temp.cardId = temp.cardId - 1
        }
        return temp
      })

      this.setState({
        answerOptions: newOptions,
        correctAnswers: reOrderCorrectAnswers
      })
    }
  }

  //handles checkboxes for correct answers
  handleCheckForCorrectAnswers(e, option, i) {
    const ids = this.state.correctAnswers.map(item => item.cardId)

    if (ids.includes(i)) {
      const newArray = this.state.correctAnswers.filter(item => item.cardId !== i)
      this.setState({
        correctAnswers: newArray
      })
    } else {
      let newArray = this.state.correctAnswers.slice(0, i)
      newArray.push({ cardId: i, value: option })
      newArray = newArray.concat(this.state.correctAnswers.slice(i))
      this.setState({
        correctAnswers: newArray
      })
    }
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

  postNewConcept = (concept, selectedCourse) => {
    conceptService
      .postConcept(concept)
      .then(res => {
        this.setState({
          concepts: this.state.concepts.concat(concept.name),
          newConcept: '',
          newConcepts: this.state.newConcepts.concat(res)
        })
        const newConcepts = selectedCourse.concepts.concat(this.state.newConcepts)
        const newCourse = {
          ...selectedCourse,
          concepts: [...newConcepts]
        }
        courseService.updateCourse(newCourse, newCourse._id)
      })
  }

  addNewConcept = (e, conceptName) => {
    conceptName = conceptName.trim()
    const selectedCourse = this.determineSelectedCourse()
    if (conceptName.length < 2) {
      notify.show('Käsitteessä on oltava vähintään kaksi merkkiä.', 'error', 2000)
      return
    } else if (this.state.newConcepts.concat(selectedCourse.concepts).filter(c => c.name === conceptName).length > 0) {
      notify.show('Kurssiin liittyy jo samanniminen käsite', 'error', 2000)
      return
    } else if (window.confirm(`Valitsemalla OK käsite "${conceptName}" lisätään heti tämän kurssin käsitteisiin.`)) {
      const newConcept = {
        name: conceptName,
        course: this.determineSelectedCourse()._id
      }
      // immediately posts the new concept to concepts and courses
      this.postNewConcept(newConcept, selectedCourse)
    }
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
    } else if (this.state.correctAnswers.length === 0) {
      console.log('No correct answers')
    } else if (this.state.correctAnswers.map(item => item.value).includes('')) {
      console.log('At least one of correct answers is empty')
    } else if (this.state.answerOptions.includes('')) {
      console.log('At least one of incorrect answers is empty')
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
        let correctAnswersAsStrings = this.state.correctAnswers.map(item => item.value)
        this.props.postGeneralQuestion(
          this.state.groupId,
          this.state.question,
          correctAnswersAsStrings,
          this.state.answerOptions,
          concepts,
          this.state.selectedValueForRadioButton
        )
        //this.addConceptsToCourses()
      }
      this.setState({
        course: '',
        groupId: '',
        questionType: '',
        question: '',
        correctAnswers: [],
        answerOptions: [],
        concepts: [],
        newConcept: '',
        newConcepts: [],
        selectedValue: '',
        selectedValueForRadioButton: ''
      })
      console.log('Post succesful')
      notify.show('Kysymys tallennettu', 'success', 2000)
    }
  }

  stepForward = () => {
    const hasDuplicates = new Set(this.state.answerOptions).size !== this.state.answerOptions.length
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
      this.state.questionType === 'GeneralQuestion' &&
      this.state.question.length < 3
    ) {
      notify.show('Kirjoita kysymys, jonka pituus on vähintään 3 merkkiä', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      (this.state.correctAnswers.includes('') ||
        this.state.answerOptions.includes(''))
    ) {
      notify.show('Ei saa sisältää tyhjiä vastauksia', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      this.state.answerOptions.length < 2
    ) {
      notify.show('Kysymyksellä tulee olla ainakin kaksi vaihtoehtoa', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      this.state.correctAnswers.length < 1
    ) {
      notify.show('Valitse ainakin yksi oikea vastaus', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      (this.state.answerOptions.length - this.state.correctAnswers.length) < 1
    ) {
      notify.show('Kysymyksessä tulee olla ainakin yksi väärä vastaus', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      hasDuplicates
    ) {
      notify.show('Kysymyksellä ei saa olla kahta samaa vaihtoehtoa', 'error', 2000)
      return
    } else if (
      this.state.step === 2 &&
      this.state.selectedValueForRadioButton === ''
    ) {
      notify.show('Valitse tuleeko vastaajan valita yksi vai useampi vaihtoehto', 'error', 2000)
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
      question.item.options = this.state.answerOptions
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
        <div className="questionFormBody">
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
                    label="Kysymyksesi"
                    multiline
                    fullWidth
                    rowsMax="6"
                    value={this.state.question}
                    onChange={this.handleChange('question')}
                    className="questionField"
                    helperText="Kirjoita tähän kysymyksesi"
                    margin="normal"
                  />
                ) : (<h2>Valitse mikä koodeista kääntyy</h2>)}
                <div className="RadioButtonForm">
                  <FormControl component="fieldset" className="RadioButtonFormControl">
                    <FormLabel component="legend">Montako vastausta voi valita?</FormLabel>
                    <RadioGroup
                      aria-label="howManyAnswers"
                      name="howManyAnswers"
                      className="Radiogroup"
                      value={this.state.selectedValueForRadioButton}
                      onChange={this.handleChange('selectedValueForRadioButton')}
                    >
                      <FormControlLabel value="selectOne" control={<Radio color="primary" />} label="Voi valita yhden vastauksen" />
                      <FormControlLabel value="selectMany" control={<Radio color="primary" />} label="Voi valita monta vastausta" />
                    </RadioGroup>
                  </FormControl>
                </div>

                {this.state.answerOptions.map((option, i) => (
                  <div key={i} className='cardContainer'>
                    <Card>
                      <CardContent>
                        <CardActions style={{ float: 'right' }}>
                          <IconButton aria-label="remove" onClick={this.removeIncorrectAnswer(option, i)} >
                            <CloseIcon />
                          </IconButton>
                        </CardActions>
                        <TextField
                          key={i}
                          label="Vastaus"
                          multiline
                          fullWidth
                          rowsMax="6"
                          value={option}
                          onChange={this.handleArrayChange(option, i)}
                          className="answerField"
                          helperText="Kirjoita vastausvaihtoehto kysymyksellesi, lisää vaihtoehtoja painamalla '+ Lisää vastausvaihtoehto'"
                          margin="normal"
                          disabled={this.state.correctAnswers.map(item => item.cardId).includes(i)}
                        />
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                label="Oikea vastaus"
                                onChange={e => this.handleCheckForCorrectAnswers(e, option, i)}
                                checked={this.state.correctAnswers.map(item => item.value).includes(option)}
                                color='primary'
                              />
                            }
                            label="Oikea vastaus"
                          />
                        </FormGroup>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                <div className="addButtonContainer">
                  <Button onClick={this.addAnswerOption} fullWidth variant="contained" color="primary" aria-label="Add">
                    + Lisää vastausvaihtoehto
                  </Button>
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
                  {this.state.newConcepts.map(concept => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          label={concept.name} key={concept.name}
                          onChange={e => this.handleCheck(e, concept.name)}
                          checked={this.state.concepts.includes(concept.name)}
                          color='primary'
                        />
                      }
                      label={concept.name}
                      key={concept.name}
                    />
                  ))}
                </FormGroup>

                <TextField
                  label='Uusi käsite'
                  multiline
                  fullWidth
                  rowsMax='6'
                  value={this.state.newConcept}
                  onChange={this.handleChange('newConcept')}
                  className='conceptField'
                  helperText='Kirjoita kysymykseesi liittyvä käsite'
                  margin='normal'
                />

                <div className='addButtonContainer'>
                  <Button onClick={e => this.addNewConcept(e, this.state.newConcept)} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                    <AddIcon className='addIcon' />
                  </Button>
                </div>
              </React.Fragment>
            )}
          </form>
        </div>

        <div className="stepContainer">
          <Steps
            disabled
            current={this.state.step}
            steps={[
              'Valitse kurssi',
              'Valitse tyyppi',
              'Täytä kentät',
              'Valitse käsitteet',
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
