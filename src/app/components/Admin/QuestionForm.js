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
  postFillInTheBlankQuestion,
  postGeneralQuestion,
  fetchQuestions
} from '../../reducers/actions/questionActions'
import { fetchCourses } from '../../reducers/actions/courseActions'
import conceptService from '../../services/conceptService'
import SimpleDialog from '../common/Dialog'
import { CardActions, IconButton, FormControl, FormLabel, RadioGroup, Radio, Grid, Chip, Typography } from '@material-ui/core'
// so far the question types are fixed
const questionTypes = [
  {
    value: 'GeneralQuestion',
    label: 'Yleinen kysymys'
  },
  {
    value: 'FillInTheBlank',
    label: 'Täytä tyhjät kohdat'
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

  addAnswerOption = () => () => {
    if (this.state.questionType === 'GeneralQuestion') {
      if (this.state.answerOptions.length < 6) {
        this.setState({
          answerOptions: [...this.state.answerOptions, { cardId: this.state.answerOptions.length > 0 ? this.state.answerOptions.length : 0, value: '', checked: false }]
        })
      }
    }
  }

  updateAllAnswerOptions = () => {
    if (this.state.questionType === 'FillInTheBlank') {
      let count = (this.state.question.match(/TYHJÄ/g) || []).length
      let copyAnswerOptions = []

      if (this.state.answerOptions.length === 0) {
        console.log('tämä kun tyhjä')
        for (let i = 0; i < count; i++) {
          copyAnswerOptions.push({ location: i, correctValues: [], newValue: '' })
        }
      } else if (this.state.answerOptions.length < count ) {
        console.log('nyt tämä kun lisätään olemassa olevaan')
        copyAnswerOptions = [...this.state.answerOptions]
        console.log(copyAnswerOptions, 'length', copyAnswerOptions.length, 'count', count)
        for (let i = copyAnswerOptions.length; i < count; i++) {
          console.log('tänne pitäisi päästä', i)
          copyAnswerOptions.push({ location: i, correctValues: [], newValue: '' })
        }
      } else if (this.state.answerOptions.length > count) {
        console.log('tämä kun vähennetään', count)
        copyAnswerOptions = this.state.answerOptions.filter(item => item.location < count)
        console.log(copyAnswerOptions)
      } else {
        console.log('ei mitään')
        copyAnswerOptions = [...this.state.answerOptions]
      }
      this.setState({
        answerOptions: copyAnswerOptions
      })
    }
  }

  addWord = (i) => event => {
    let copy = [...this.state.answerOptions]
    //PITÄIS OLLA SALLITTU COPY KUN EI OO SAMA KUN STATE TOLLA ... SYNTAKSILLA
    console.log(copy === this.state.answerOptions)
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
    console.log(copy)
    this.setState({
      answerOptions: copy
    })
  }

  // handles changes of answerOptions in state
  handleArrayChange = (option, i) => event => {
    if (this.state.questionType === 'GeneralQuestion') {
      let newArray = this.state.answerOptions.slice(0, i)
      newArray.push({ cardId: i, value: event.target.value, checked: option.checked })
      newArray = newArray.concat(this.state.answerOptions.slice(i + 1))
      this.setState({
        answerOptions: newArray
      })
    } else if (this.state.questionType === 'FillInTheBlank') {
      console.log(option)
      let copy = [...this.state.answerOptions]
      //PITÄIS OLLA SALLITTU COPY KUN EI OO SAMA KUN STATE TOLLA ... SYNTAKSILLA
      console.log(copy === this.state.answerOptions)
      copy[i].newValue = event.target.value
      this.setState({
        answerOptions: copy
      })
    }
  }

  // removes incorrect answer and rearranges the card ids for correct answers
  removeAnswerOption = (option, i) => () => {
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

  postNewConcept = (concept) => {
    conceptService
      .postConcept(concept)
      .then(res => {
        this.setState({
          concepts: this.state.concepts.concat(res._id),
          newConcept: '',
          newConcepts: this.state.newConcepts.concat(res)
        })
      })
  }

  addNewConcept = (e, conceptName) => {
    conceptName = conceptName.trim()
    const selectedCourse = this.determineSelectedCourse()
    if (conceptName.length < 2) {
      notify.show('Käsitteessä on oltava vähintään kaksi merkkiä.', 'error', 3000)
      return
    } else if (this.state.newConcepts.concat(selectedCourse.concepts).filter(c => c.name === conceptName).length > 0) {
      notify.show('Kurssiin liittyy jo samanniminen käsite', 'error', 3000)
      return
    } else if (window.confirm(`Valitsemalla OK käsite "${conceptName}" lisätään heti tämän kurssin käsitteisiin.`)) {
      const newConcept = {
        name: conceptName,
        course: selectedCourse._id
      }
      // immediately posts the new concept to concepts and courses
      this.postNewConcept(newConcept)
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
    } else if (this.state.answerOptions.map(item => item.checked === true).length === 0) {
      console.log('No correct answers')
    } else if (this.state.answerOptions.map(item => item.value).includes('')) {
      console.log('At least one of answer options is empty')
    } else if (this.state.concepts.length < 1) {
      console.log('Concept is not set!')
    } else {
      // If the question is valid
      this.setState({ step: this.state.step + 1 })
      const concepts = this.mapConceptIDsToObjects().concat(
        this.state.newConcepts.filter(c => this.state.concepts.includes(c._id)))
      if (this.state.questionType === 'FillInTheBlank') {
        console.log(this.state.answerOptions.map(item => item.correctValues))
        this.props.postFillInTheBlankQuestion(
          this.state.groupId,
          this.state.question,
          this.state.answerOptions.map(item => item.correctValues),
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
        //this.addConceptsToCourses()
      }
      this.setState({
        course: '',
        groupId: '',
        questionType: '',
        question: '',
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
    let hasDuplicates = false
    let correctAnswers = false
    let containsAtLeastOneBlank = false
    let containsEmptyWord = false
    if (this.state.questionType === 'GeneralQuestion') {
      hasDuplicates = new Set(this.state.answerOptions).size !== this.state.answerOptions.length
      correctAnswers = this.state.answerOptions.filter(item => item.checked === true).map(item => item.value)
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
      this.state.step === 2 &&
      this.state.question.length < 3
    ) {
      notify.show('Kirjoita kysymys, jonka pituus on vähintään 3 merkkiä', 'error', 3000)
      return
    } else if (
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
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
      this.state.step === 2 && this.state.questionType === 'GeneralQuestion' &&
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
      this.state.step === 3 &&
      this.state.concepts.length < 1
    ) {
      notify.show('Valitse ainakin yksi käsite', 'error', 3000)
      return
    }
    this.setState({ step: this.state.step + 1 })
    question.kind = this.state.questionType
    question.item.value = this.state.question
    if (this.state.step > 1) {
      question.item.options = this.state.answerOptions.map(item => item.value)
    }
  }

  render() {
    const { step, questionType } = this.state
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
                          <IconButton aria-label="remove" onClick={this.removeAnswerOption(option, i)} style={{ marginLeft: '300px' }} >
                            <CloseIcon />
                          </IconButton>
                        </CardActions>
                        <TextField
                          key={i}
                          label="Vastaus"
                          multiline
                          fullWidth
                          rowsMax="6"
                          value={option.value}
                          onChange={this.handleArrayChange(option, i)}
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
                  <Button onClick={this.addAnswerOption()} fullWidth variant="contained" color="primary" aria-label="Add">
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
                      <Grid container spacing={40} direction="row" alignItems="center" >
                        <Grid item>
                          <TextField
                            label="Vastausvaihtoehto"
                            value={option.newValue}
                            onChange={this.handleArrayChange(option, i)}
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
                          {i+1}:n tyhjän kentän oikeat vastaukset:
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
                          onChange={e => this.handleCheck(e, concept._id)}
                          checked={this.state.concepts.includes(concept._id)}
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
  postFillInTheBlankQuestion,
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