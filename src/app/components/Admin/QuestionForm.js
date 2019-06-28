import React, { Component } from 'react'
import { connect } from 'react-redux'
import Steps from 'react-simple-steps'
import Notifications, { notify } from 'react-notify-toast'
import { TextField, Button, InputLabel, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core'
import { Save as SaveIcon, Add as AddIcon, ArrowForward, ArrowBack as ArrowBackward } from '@material-ui/icons'
import DumbQuestion from '../Question/DumbQuestion'
import ConfirmPopup from './Popups/ConfirmPopup'
import './admin.css'
import { postFillInTheBlankQuestion, postGeneralQuestion, postDragAndDropQuestion, fetchQuestions } from '../../reducers/actions/questionActions'
import { fetchCourses } from '../../reducers/actions/courseActions'
import conceptService from '../../services/conceptService'
import SelectBox from '../common/SelectBox'
import GeneralQuestionForm from './GeneralQuestionForm'
import FillQuestionForm from './FillQuestionForm'
import DragAndDropQuestionForm from './DragAndDropQuestionForm'
// so far the question types are fixed
const questionTypes = [
  {
    value: 'GeneralQuestion',
    label: 'Monivalinta'
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

  fetchData = async () => {
    try {
      await this.props.fetchCourses()
      await this.props.fetchQuestions()
    } catch (e) {
      console.log(e)
      return
    }
  }

  componentDidMount = () => {
    this.fetchData()
  }

  handleNewQuestion = () => {
    this.fetchData()
    this.setState({ step: 0 })
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

  // belogsToCorrectAnswers is used as a boolean value to check which state array should be updated, this check is mainly for drag and drop question
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

  // deletes a single chip
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
  handleCheckForCorrectAnswers = (option, i) => () => {
    // First if-else checks that only one correct answer can be checked if radiobutton is selected to be select one
    // Other ifs are to make sure that the selection can be changed and the change is made to correct card
    console.log(this.state.answerOptions)
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

  // swaps to cards in drag and drop question form
  swapTwoCards = (direction, index) => () => {
    let copy = [...this.state.answerOptions]
    let temp = copy[index]
    if (direction === 'up') {
      copy[index] = { ...copy[index-1], cardId: copy[index-1].cardId + 1 }
      copy[index-1] = { ...temp, cardId: temp.cardId - 1 }
    } else {
      copy[index] = { ...copy[index+1], cardId: copy[index+1].cardId - 1 }
      copy[index+1] = { ...temp, cardId: temp.cardId + 1 }
    }

    this.setState({
      answerOptions: copy
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
        this.props.postFillInTheBlankQuestion(
          this.state.groupId,
          this.state.question,
          this.state.answerOptions.map(item => item.correctValues),
          concepts
        )
      } else if (this.state.questionType === 'DragAndDrop') {
        let allAnswers = this.state.answerOptions.map(item => item.value).concat(this.state.fakeAnswerOptions.map(item => item.value))
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
                  <SelectBox
                    key={course._id}
                    className="courseSelectBox"
                    content={course.name}
                    onClick={() => this.handleSelectCourse(course)}
                    selected={course._id === this.state.course._id}
                  />
                ))}
                {this.state.course.groups ? (
                  <div>
                    <InputLabel style={{ fontSize: 13 }}>Ryhmä</InputLabel>
                    {this.state.course.groups.map(group => (
                      <SelectBox
                        key={group._id}
                        className="groupSelectBox"
                        content={group.name}
                        onClick={() => this.handleSelectGroup(group._id)}
                        selected={group._id === this.state.groupId} />
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
                  <SelectBox
                    key={option.value}
                    className="typeSelectBox"
                    content={option.label}
                    onClick={() => this.handleSelectType(option.value)}
                    selected={option.value === this.state.questionType} />
                ))}
              </React.Fragment>
            )}

            {step === 2 && (questionType === 'GeneralQuestion') && (
              <GeneralQuestionForm
                handleClickOpen={this.handleClickOpen}
                selectedValue={this.state.selectedValue}
                modalOpen={this.state.modalOpen}
                handleClose={this.handleClose}
                questions={this.props.questions.filter(item => item.group._id === this.state.groupId)}
                question={this.state.question}
                handleChange={this.handleChange}
                selectedValueForRadioButton={this.state.selectedValueForRadioButton}
                answerOptions={this.state.answerOptions}
                removeAnswerOption={this.removeAnswerOption}
                handleArrayChange={this.handleArrayChange}
                handleCheckForCorrectAnswers={this.handleCheckForCorrectAnswers}
                addAnswerOption={this.addAnswerOption}
              />
            )}

            {step === 2 && (questionType === 'FillInTheBlank') && (
              <FillQuestionForm
                handleChange={this.handleChange}
                handleArrayChange={this.handleArrayChange}
                addWord={this.addWord}
                handleWordDelete={this.handleWordDelete}
                updateAllAnswerOptions={this.updateAllAnswerOptions}
                question={this.state.question}
                answerOptions={this.state.answerOptions}
              />
            )}

            {step === 2 && (questionType === 'DragAndDrop') && (
              <DragAndDropQuestionForm
                handleChange={this.handleChange}
                handleArrayChange={this.handleArrayChange}
                addAnswerOption={this.addAnswerOption}
                removeAnswerOption={this.removeAnswerOption}
                swapTwoCards={this.swapTwoCards}
                question={this.state.question}
                answerOptions={this.state.answerOptions}
                fakeAnswerOptions={this.state.fakeAnswerOptions}
              />
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

                <ConfirmPopup
                  title={`Oletko varma, että haluat lisätä uuden käsitteen "${this.state.newConcept}" ?`}
                  description1={'Valitsemalla OK käsite lisätään heti kurssin käsitteisiin.'}
                  okText={'OK'}
                  toggle={this.toggleConfirmPopup}
                  okClick={() => this.addNewConcept(this.state.newConcept)} checked={this.state.showConfirmPopup} timeout={200}
                />
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
                  onClick={() => this.handleNewQuestion()}
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