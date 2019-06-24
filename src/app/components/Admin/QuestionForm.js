import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
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
import ConfirmPopup from './Popups/ConfirmPopup'
import './admin.css'
import {
  postFillInTheBlankQuestion,
  postGeneralQuestion,
  postDragAndDropQuestion,
  fetchQuestions
} from '../../reducers/actions/questionActions'
import { fetchCourses } from '../../reducers/actions/courseActions'
import conceptService from '../../services/conceptService'
import SimpleDialog from '../common/Dialog'
import { CardActions, IconButton, FormControl, FormLabel, RadioGroup, Radio, Grid, Chip, Typography, Divider } from '@material-ui/core'
import SelectBox from '../common/SelectBox'
// so far the question types are fixed
const questionTypes = [
  {
    value: 'GeneralQuestion',
    label: 'Yleinen kysymys'
  },
  {
    value: 'FillInTheBlank',
    label: 'Täytä tyhjät kohdat'
  },
  {
    value: 'DragAndDrop',
    label: 'Sijoita osat kohdilleen'
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
      answerOptions: [],
      step: 0,
      courses: [],
      questions: [],
      checkedConceptIds: [],
      concepts: [],
      modalOpen: false,
      selectedValue: '',
      selectedValueForRadioButton: '',
      toggleConfirmPopup: false,
      fakeAnswerOptions: []
    }
  }

  async componentDidMount() {
    try {
      await this.props.fetchCourses()
      await this.props.fetchQuestions()

    } catch (e) {
      console.log(e)
      return
    }
  }

  // handles change of questionType, question and selected value of radiobutton in state
  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    })
    if (this.state.questionType === 'GeneralQuestion') {
      const checkedElements = this.state.answerOptions.filter(item => item.checked === true)
      if (checkedElements.length > 1 && e.target.value === ('selectOne')) {
        notify.show('Muutettu valintojen määrää, poista ylimääräiset oikeat vastaukset', 'error', 3000)
      }
    }
  }

  // handles modal's open status
  handleClickOpen = () => {
    this.setState({
      modalOpen: true
    })
  }
  // gets the value from the modal
  handleClose = value => {
    this.setState({
      selectedValue: value,
      modalOpen: false,
      question: value
    })
  }

  addAnswerOption = (belongsToCorrectAnswers) => () => {
    if (this.state.answerOptions.length < 6 && this.state.questionType === 'GeneralQuestion') {
      this.setState({
        answerOptions: [...this.state.answerOptions, { cardId: this.state.answerOptions.length > 0 ? this.state.answerOptions.length : 0, value: '', checked: false }]
      })
    }
    if (this.state.questionType === 'DragAndDrop' && !belongsToCorrectAnswers) {
      this.setState({
        fakeAnswerOptions: [...this.state.fakeAnswerOptions, { cardId: this.state.fakeAnswerOptions.length > 0 ? this.state.fakeAnswerOptions.length : 0, value: '' }]
      })
    } else if (this.state.questionType === 'DragAndDrop' && belongsToCorrectAnswers) {
      this.setState({
        answerOptions: [...this.state.answerOptions, { cardId: this.state.answerOptions.length > 0 ? this.state.answerOptions.length : 0, value: '' }]
      })
    }
  }

  // updates the answer option fields for fill in the blank type question
  updateAllAnswerOptions = () => {
    if (this.state.questionType === 'FillInTheBlank') {
      let count = (this.state.question.match(/TYHJÄ/g) || []).length
      let copyAnswerOptions = []

      if (this.state.answerOptions.length === 0) {
        for (let i = 0; i < count; i++) {
          copyAnswerOptions.push({ location: i, correctValues: [], newValue: '' })
        }
      } else if (this.state.answerOptions.length < count) {
        console.log('nyt tämä kun lisätään olemassa olevaan')
        copyAnswerOptions = [...this.state.answerOptions]
        for (let i = copyAnswerOptions.length; i < count; i++) {
          copyAnswerOptions.push({ location: i, correctValues: [], newValue: '' })
        }
      } else if (this.state.answerOptions.length > count) {
        copyAnswerOptions = this.state.answerOptions.filter(item => item.location < count)
      } else {
        copyAnswerOptions = [...this.state.answerOptions]
      }
      this.setState({
        answerOptions: copyAnswerOptions
      })
    }
  }

  // adds word as a acceptable value to given blank
  addWord = (i) => event => {
    let copy = [...this.state.answerOptions]
    copy[i].correctValues.push(copy[i].newValue)
    copy[i].newValue = ''
    this.setState({
      answerOptions: copy
    })
    event.preventDefault()
  }

  handleWordDelete = (chipToDelete, i) => () => {
    let copy = this.state.answerOptions
    copy[i].correctValues = copy[i].correctValues.filter(item => item !== chipToDelete)
    this.setState({
      answerOptions: copy
    })
  }

  // handles changes of answerOptions in state
  handleArrayChange = (option, i, belongsToCorrectAnswers) => event => {
    if (this.state.questionType === 'GeneralQuestion') {
      let newArray = this.state.answerOptions.slice(0, i)
      newArray.push({ cardId: i, value: event.target.value, checked: option.checked })
      newArray = newArray.concat(this.state.answerOptions.slice(i + 1))
      this.setState({
        answerOptions: newArray
      })
    } else if (this.state.questionType === 'FillInTheBlank') {
      let copy = [...this.state.answerOptions]
      copy[i].newValue = event.target.value
      this.setState({
        answerOptions: copy
      })
    } else if (this.state.questionType === 'DragAndDrop' && belongsToCorrectAnswers) {
      let newArray = this.state.answerOptions.slice(0, i)
      newArray.push({ cardId: i, value: event.target.value })
      newArray = newArray.concat(this.state.answerOptions.slice(i + 1))
      this.setState({
        answerOptions: newArray
      })
    } else if (this.state.questionType === 'DragAndDrop' && !belongsToCorrectAnswers) {
      let newArray = this.state.fakeAnswerOptions.slice(0, i)
      newArray.push({ cardId: i, value: event.target.value })
      newArray = newArray.concat(this.state.fakeAnswerOptions.slice(i + 1))
      this.setState({
        fakeAnswerOptions: newArray
      })
    }
  }

  // removes incorrect answer and rearranges the card ids for correct answers
  removeAnswerOption = (option, i, belongsToCorrectAnswers) => () => {
    if (this.state.questionType === 'GeneralQuestion' || (this.state.questionType === 'DragAndDrop' && belongsToCorrectAnswers)) {
      if (this.state.answerOptions.length > 1) {
        let newOptions = this.state.answerOptions
        newOptions.splice(i, 1)
        let reOrderAnswerOptions = newOptions.map(item => {
          let temp = Object.assign({}, item)
          if (temp.cardId > i) {
            temp.cardId = temp.cardId - 1
          }
          return temp
        })
        this.setState({
          answerOptions: reOrderAnswerOptions
        })
      }
    } else if (this.state.questionType === 'DragAndDrop' && !belongsToCorrectAnswers) {
      let newOptions = this.state.fakeAnswerOptions
      newOptions.splice(i, 1)
      let reOrderAnswerOptions = newOptions.map(item => {
        let temp = Object.assign({}, item)
        if (temp.cardId > i) {
          temp.cardId = temp.cardId - 1
        }
        return temp
      })
      this.setState({
        fakeAnswerOptions: reOrderAnswerOptions
      })
    }
  }

  // handles checkboxes for correct answers
  handleCheckForCorrectAnswers(e, option, i) {
    // First if-else checks that only one correct answer can be checked if radiobutton is selected to be select one
    // Other ifs are to make sure that the selection can be changed and the change is made to correct card
    const checkedElements = this.state.answerOptions.filter(item => item.checked === true)
    if (checkedElements.length > 0 && this.state.selectedValueForRadioButton === 'selectOne') {
      if (checkedElements.length > 2) {
        notify.show('Oikeita vastauksia liikaa, vähennä oikeiden vastausten määrää tai muuta käyttäjän tekemien valintojen määrää', 'error', 3000)
      }
      if (checkedElements.includes(option)) {
        let changedCheckedStatus = this.state.answerOptions.map(item => {
          let temp = Object.assign({}, item)
          if (temp.cardId === i) {
            temp.checked = !temp.checked
          }
          return temp
        })
        this.setState({
          answerOptions: changedCheckedStatus
        })
      }
    } else {
      let changedCheckedStatus = this.state.answerOptions.map(item => {
        let temp = Object.assign({}, item)
        if (temp.cardId === i) {
          temp.checked = !temp.checked
        }
        return temp
      })
      this.setState({
        answerOptions: changedCheckedStatus
      })
    }
  }

  handleCheckConcept(conceptId) {
    this.setState(state => ({
      checkedConceptIds: state.checkedConceptIds.includes(conceptId)
        ? state.checkedConceptIds.filter(c => c !== conceptId)
        : [...state.checkedConceptIds, conceptId]
    }))
  }

  handleSelectType(type) {
    this.setState(state => ({
      questionType: state.questionType === type ? '' : type
    }))
  }

  handleSelectCourse(course) {
    this.setState(state => ({
      course: state.course._id === course._id ? '' : course,
      groupId: ''
    }))
  }

  handleSelectGroup(groupId) {
    this.setState(state => ({
      groupId: state.groupId === groupId ? '' : groupId
    }))
  }

  postNewConcept = (concept) => {
    conceptService
      .postConcept(concept)
      .then(res => {
        this.setState({
          checkedConceptIds: this.state.checkedConceptIds.concat(res._id),
          newConcept: '',
          concepts: this.state.concepts.concat(res)
        })
      })
  }

  addNewConcept = (conceptName) => {
    conceptName = conceptName.trim()
    if (conceptName.length < 2) {
      notify.show('Käsitteessä on oltava vähintään kaksi merkkiä.', 'error', 3000)
      return
    } else if (this.state.concepts.filter(c => c.name === conceptName).length > 0) {
      notify.show('Kurssiin liittyy jo samanniminen käsite', 'error', 3000)
      return
    } else {
      const newConcept = {
        name: conceptName,
        course: this.state.course._id
      }
      // immediately posts the new concept to concepts and courses
      this.postNewConcept(newConcept)
    }
  }

  toggleConfirmPopup = () => {
    this.setState({ showConfirmPopup: !this.state.showConfirmPopup })
  }

  setInitialConcepts = () => {
    if (this.state.course.concepts) this.setState({
      concepts: this.state.course.concepts
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
      this.state.questionType !== 'DragAndDrop'
    ) {
      console.log('Question is empty!')
    } else if (this.state.answerOptions.map(item => item.checked === true).length === 0) {
      console.log('No correct answers')
    } else if (this.state.answerOptions.map(item => item.value).includes('')) {
      console.log('At least one of answer options is empty')
    } else if (this.state.checkedConceptIds.length < 1) {
      console.log('Concept is not set!')
    } else {
      // If the question is valid
      this.setState({ step: this.state.step + 1 })
      const concepts = this.state.concepts.filter(c => this.state.checkedConceptIds.includes(c._id))
      if (this.state.questionType === 'FillInTheBlank') {
        console.log(this.state.answerOptions.map(item => item.correctValues))
        this.props.postFillInTheBlankQuestion(
          this.state.groupId,
          this.state.question,
          this.state.answerOptions.map(item => item.correctValues),
          concepts
        )
      } else if (this.state.questionType === 'DragAndDrop') {
        let allAnswers = this.state.answerOptions.map(item => item.value).concat(this.state.fakeAnswerOptions.map(item => item.value))
        console.log(allAnswers)
        this.props.postDragAndDropQuestion(
          this.state.groupId,
          this.state.question,
          this.state.answerOptions.map(item => item.value),
          allAnswers,
          concepts
        )
      } else {
        let correctAnswersAsStrings = this.state.answerOptions.filter(item => item.checked === true).map(item => item.value)
        this.props.postGeneralQuestion(
          this.state.groupId,
          this.state.question,
          correctAnswersAsStrings,
          this.state.answerOptions.map(item => item.value),
          concepts,
          this.state.selectedValueForRadioButton
        )
      }
      this.setState({
        course: '',
        groupId: '',
        questionType: '',
        question: '',
        answerOptions: [],
        fakeAnswerOptions: [],
        checkedConceptIds: [],
        newConcept: '',
        concepts: [],
        selectedValue: '',
        selectedValueForRadioButton: ''
      })
      console.log('Post succesful')
      notify.show('Kysymys tallennettu', 'success', 2000)
    }
  }

  stepForward = () => {
    let hasDuplicates = false
    let correctAnswers = false
    let containsAtLeastOneBlank = false
    let containsEmptyWord = false
    let correctValuesContainsFakeValue = false
    if (this.state.questionType === 'GeneralQuestion') {
      let answerOptionValues = this.state.answerOptions.map(option => option.value)
      hasDuplicates = new Set(answerOptionValues).size !== answerOptionValues.length
      correctAnswers = this.state.answerOptions.filter(item => item.checked === true).map(item => item.value)
    } else if (this.state.questionType === 'DragAndDrop') {
      let answerOptionValues = this.state.answerOptions.map(option => option.value)
      correctValuesContainsFakeValue = answerOptionValues.some(correct => this.state.fakeAnswerOptions.map(item => item.value).includes(correct))
      hasDuplicates = new Set(answerOptionValues).size !== answerOptionValues.length
    } else if (this.state.questionType === 'FillInTheBlank') {
      containsAtLeastOneBlank = this.state.question.includes('TYHJÄ')
      let helper = this.state.answerOptions.map(option => option.correctValues.some(item => item === '') || option.correctValues.length === 0)
      containsEmptyWord = helper.includes(true)
    }

    if (this.state.step === 0 && this.state.course === '') {
      notify.show('Valitse kurssi', 'error', 3000)
      return
    } else if (this.state.step === 0 && this.state.groupId === '') {
      notify.show('Valitse ryhmä', 'error', 3000)
      return
    } else if (this.state.step === 1 && this.state.questionType === '') {
      notify.show('Valitse kysymystyyppi', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.question.length < 3
    ) {
      notify.show('Kirjoita kysymys, jonka pituus on vähintään 3 merkkiä', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && (this.state.questionType === 'GeneralQuestion' || this.state.questionType === 'DragAndDrop') &&
      this.state.answerOptions.map(item => item.value).includes('')
    ) {
      notify.show('Ei saa sisältää tyhjiä vastauksia', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
      this.state.answerOptions.length < 2
    ) {
      notify.show('Kysymyksellä tulee olla ainakin kaksi vaihtoehtoa', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
      correctAnswers.length < 1
    ) {
      notify.show('Valitse ainakin yksi oikea vastaus', 'error', 2000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
      (this.state.answerOptions.length - correctAnswers.length) < 1
    ) {
      notify.show('Kysymyksessä tulee olla ainakin yksi väärä vastaus', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && (this.state.questionType === 'GeneralQuestion' || this.state.questionType === 'DragAndDrop') &&
      hasDuplicates
    ) {
      notify.show('Kysymyksellä ei saa olla kahta samaa vaihtoehtoa', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
      this.state.selectedValueForRadioButton === ''
    ) {
      notify.show('Valitse tuleeko vastaajan valita yksi vai useampi vaihtoehto', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
      this.state.selectedValueForRadioButton === 'selectOne' &&
      correctAnswers.length > 1
    ) {
      notify.show('Poista ylimääräiset oikeat vastaukset tai muuta valintaa oikeiden vastausten määrästä', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'FillInTheBlank' &&
      !containsAtLeastOneBlank
    ) {
      notify.show('Kysymyksellä ei ole yhtään vastauskenttää määritelty', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'FillInTheBlank' &&
      this.state.answerOptions.length === 0
    ) {
      notify.show('Ei tallennettuja vastausvaihtoehtoja', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'FillInTheBlank' &&
      containsEmptyWord
    ) {
      notify.show('Jokin vastausvaihtoehtokenttä sisältää tyhjän vastauksen', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'DragAndDrop' &&
      this.state.fakeAnswerOptions.map(item => item.value).includes('')
    ) {
      notify.show('Väärissä vaihtoehdoissa ei voi olla tyhjää riviä', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'DragAndDrop' &&
      this.state.answerOptions.length + this.state.fakeAnswerOptions.length < 2
    ) {
      notify.show('Kysymykseen tulee liittyä ainakin kaksi vastausta', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'DragAndDrop' &&
      correctValuesContainsFakeValue
    ) {
      notify.show('Väärissä vastauksissa on rivi, joka on jo oikeissa vastauksissa', 'error', 3000)
      return
    } else if (
      this.state.step === 3 &&
      this.state.checkedConceptIds.length < 1
    ) {
      notify.show('Valitse ainakin yksi käsite', 'error', 3000)
      return
    }
    if (this.state.questionType === 'DragAndDrop' && this.state.answerOptions.length === 0) {
      this.setState({ answerOptions: [{ cardId: 0, value: '', checked: true }] })
    }

    this.setState({ step: this.state.step + 1 })
    question.kind = this.state.questionType
    question.item.value = this.state.question
    if (this.state.step > 1) {
      question.item.options = this.state.answerOptions.map(item => item.value)
    }
    // setting concepts to hold existing ones, once, after the course has been chosen
    if (this.state.concepts.length < 1) this.setInitialConcepts()
  }

  stepBack = () => {
    if (this.state.step === 2) {
      this.setState({ answerOptions: [], fakeAnswerOptions: [], question: '' })
    }
    this.setState({ step: this.state.step - 1 })
  }

  render() {
    const { step, questionType } = this.state
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
                {this.props.courses.map(course => (
                  <SelectBox key={course._id} content={course.name} onClick={() => this.handleSelectCourse(course)} selected={course._id === this.state.course._id} />
                ))}
                {this.state.course.groups ? (
                  <div>
                    <InputLabel style={{ fontSize: 13 }}>Ryhmä</InputLabel>
                    {this.state.course.groups.map(group => (
                      <SelectBox key={group._id} content={group.name} onClick={() => this.handleSelectGroup(group._id)} selected={group._id === this.state.groupId} />
                    ))}
                  </div>
                ) : null}
              </React.Fragment>
            )}

            {step === 1 && (
              <React.Fragment>
                <h2>Valitse tyyppi</h2>
                <InputLabel style={{ fontSize: 13 }}>Kysymystyyppi</InputLabel>
                {questionTypes.map(option => (
                  <SelectBox key={option.value} content={option.label} onClick={() => this.handleSelectType(option.value)} selected={option.value === this.state.questionType} />
                ))}
              </React.Fragment>
            )}

            {step === 2 && (questionType === 'GeneralQuestion') && (
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
                    questions={this.props.questions.filter(item => item.group._id === this.state.groupId)}
                  />
                </div>
                <div>
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
                </div>
                <div className="radioButtonForm">
                  <FormControl component="fieldset" className="RadioButtonFormControl">
                    <FormLabel component="legend">Montako vastausta käyttäjä voi valita?</FormLabel>
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
                      <CardContent style={{ marginBottom: '-25px' }}>
                        <CardActions className='cardActionArea'>
                          <IconButton aria-label="remove" onClick={this.removeAnswerOption(option, i, null)}>
                            <CloseIcon />
                          </IconButton>
                        </CardActions>
                        <TextField
                          key={i}
                          label="Vastaus"
                          fullWidth
                          multiline={true}
                          inputProps={{
                            maxLength: 45
                            // if card content rendering multiple rows gets fixed, change length to higher:
                            // maxLength: 255
                          }}
                          value={option.value}
                          onChange={this.handleArrayChange(option, i, null)}
                          className="answerField"
                          helperText="Kirjoita vastausvaihtoehto kysymyksellesi, lisää vaihtoehtoja painamalla '+ Lisää vastausvaihtoehto'"
                          margin="normal"
                        />
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                label="Oikea vastaus"
                                onChange={e => this.handleCheckForCorrectAnswers(e, option, i)}
                                checked={option.checked}
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
                  <Button onClick={this.addAnswerOption(null)} fullWidth variant="contained" color="primary" aria-label="Add">
                    + Lisää vastausvaihtoehto
                  </Button>
                </div>

              </React.Fragment>
            )}

            {step === 2 && (questionType === 'FillInTheBlank') && (
              <React.Fragment>
                <div>
                  <TextField
                    label="Kysymyksesi"
                    multiline
                    fullWidth
                    rowsMax="3"
                    value={this.state.question}
                    onChange={this.handleChange('question')}
                    className="questionField"
                    helperText="Kirjoita tähän kysymyksesi ja TYHJÄ niiden sanojen kohdalle, jotka käyttäjän tulee vastauksessaan täyttää"
                    placeholder="Esimerkiksi: Hauki on TYHJÄ"
                    margin="normal"
                  />
                </div>
                <div>
                  {this.state.answerOptions.map((option, i) => (
                    <div key={i}>
                      <Grid container spacing={40} direction="row" alignItems="center">
                        <Grid item>
                          <TextField
                            label="Vastausvaihtoehto"
                            value={option.newValue}
                            onChange={this.handleArrayChange(option, i, null)}
                            className="answerField"
                            helperText='Kirjoita oikea vastausvaihtoehto sanalle ja tallenna sana painamalla +'
                            margin="normal"
                          />
                        </Grid>
                        <Grid item>
                          <Button onClick={this.addWord(i)} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                            <AddIcon className='addIcon' />
                          </Button>
                        </Grid>
                      </Grid>
                      {this.state.answerOptions[i].correctValues.length === 0 ? '' : (
                        <Typography variant="body1" gutterBottom>
                          {i + 1}:n tyhjän kentän oikeat vastaukset:
                        </Typography>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {option.correctValues.map((item, j) => (
                          <Chip key={j} label={item} onDelete={this.handleWordDelete(item, i)} style={{ marginRight: '5px', marginBottom: '10px' }} />
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
                <div className="addButtonContain">
                  <Button onClick={this.updateAllAnswerOptions} fullWidth variant="contained" color="primary" aria-label="Add">
                    {this.state.answerOptions.length === 0 ? 'Luo vastausvaihtoehdoille kentät' : 'Päivitä vastausvaihtoehtojen kentät'}
                  </Button>
                </div>
              </React.Fragment>
            )}

            {step === 2 && (questionType === 'DragAndDrop') && (
              <React.Fragment>
                <TextField
                  label="Kysymyksen otsikko"
                  fullWidth
                  value={this.state.question}
                  onChange={this.handleChange('question')}
                  className="questionField"
                  placeholder="Esim. Järjestä palat siten, että rivit ovat oikeassa järjestyksessä"
                  margin="normal"
                />
                <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Typography variant="title" gutterBottom>
                  Luo haluamasi oikea järjestys
                </Typography>
                {this.state.answerOptions.map((option, i) => (
                  <div className='cardContainer' key={i}>
                    <Card>
                      <CardContent style={{ marginBottom: '-25px' }}>
                        <CardActions className='cardActionArea'>
                          <IconButton aria-label="remove" onClick={this.removeAnswerOption(option, i, true)}>
                            <CloseIcon />
                          </IconButton>
                        </CardActions>
                        <TextField
                          label="Teksti riville"
                          fullWidth
                          value={option.value}
                          onChange={this.handleArrayChange(option, i, true)}
                          className="answerField"
                          helperText="Kirjoita teksti kenttään, voit lisätä tekstikenttiä painamalla '+ Lisää kenttä'"
                          margin="normal"
                        />
                      </CardContent>
                    </Card>
                  </div>
                ))}

                <Button onClick={this.addAnswerOption(true)} fullWidth variant="contained" color="primary" aria-label="Add">
                  + Lisää kenttä
                </Button>
                <Divider variant='middle' style={{ marginTop: '20px', marginBottom: '20px' }} />
                <Typography variant='title' gutterBottom>
                  Voit luoda myös vastaukseen kuulumattomia rivejä
                </Typography>

                {this.state.fakeAnswerOptions.map((option, i) => (
                  <div className='cardContainer' key={i}>
                    <Card>
                      <CardContent style={{ marginBottom: '-25px' }}>
                        <CardActions className='cardActionArea'>
                          <IconButton aria-label="remove" onClick={this.removeAnswerOption(option, i, false)}>
                            <CloseIcon />
                          </IconButton>
                        </CardActions>
                        <TextField
                          label="Teksti vastaukseen kuulumattomalle riville"
                          fullWidth
                          value={option.value}
                          onChange={this.handleArrayChange(option, i, false)}
                          className="answerField"
                          helperText="Kirjoita teksti riville, joka ei kuulu vastaukseen. Voit lisätä rivejä painamalla '+ Lisää vastaukseen kuulumaton rivi'"
                          margin="normal"
                        />
                      </CardContent>
                    </Card>
                  </div>
                ))}
                <Button onClick={this.addAnswerOption(false)} fullWidth variant="contained" color="primary" aria-label="Add">
                  + Lisää vastaukseen kuulumaton rivi
                </Button>

              </React.Fragment>
            )}

            {step === 3 && (
              <React.Fragment>
                <h2>Valitse mihin käsitteisiin kysymys liittyy</h2>
                <FormGroup>
                  {this.state.concepts.map(concept => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          label={concept.name} key={concept._id}
                          onChange={() => this.handleCheckConcept(concept._id)}
                          checked={this.state.checkedConceptIds.includes(concept._id)}
                          color='primary'
                        />
                      }
                      label={concept.name}
                      key={concept._id}
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
                  <Button onClick={this.toggleConfirmPopup} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                    <AddIcon className='addIcon' />
                  </Button>
                </div>

                <ConfirmPopup title={`Oletko varma, että haluat lisätä uuden käsitteen "${this.state.newConcept}" ?`} description1={'Valitsemalla OK käsite lisätään heti kurssin käsitteisiin.'} okText={'OK'} toggle={this.toggleConfirmPopup} okClick={() => this.addNewConcept(this.state.newConcept)} checked={this.state.showConfirmPopup} timeout={200} />
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
                onClick={this.stepBack}
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
  postFillInTheBlankQuestion,
  postDragAndDropQuestion,
  postGeneralQuestion,
  fetchCourses,
  fetchQuestions
}

const mapStateToProps = state => {
  return {
    courses: state.course.courses,
    questions: state.question.questions
  }
}

const ConnectedQuestionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionForm)

export default ConnectedQuestionForm