import React, { Component } from 'react'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import Steps from 'react-simple-steps'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBackward from '@material-ui/icons/ArrowBack'
import DumbQuestion from '../Question/DumbQuestion'
import './admin.css'
import Notifications, { notify } from 'react-notify-toast'
import { postCompileQuestion, postPrintQuestion } from '../../reducers/actions/questionActions'
import { fetchCourses } from '../../reducers/actions/courseActions'

//toistaiseksi tyypit kovakoodattu
const questionTypes = [
  {
    value: 'CompileQuestion',
    label: 'valitse mikä koodeista kääntyy'
  },
  {
    value: 'PrintQuestion',
    label: 'valitse mitä koodi tulostaa'
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
      correctAnswer: '',
      incorrectAnswers: [''],
      step: 0,
      courses: []
    }
  }

  async componentDidMount() {
    try {
      await this.props.fetchCourses()
    } catch (e) {
      console.log(e)
      return
    }
  }

  //handles change of questionType, question and correctAnswer in state
  handleChange = (name) => e => {
    this.setState({
      [name]: e.target.value
    })
  }

  addIncorrectAnswer = () => {
    if (this.state.incorrectAnswers.length < 4) {
      this.setState({
        incorrectAnswers: [...this.state.incorrectAnswers, '']
      })
    }
  }

  //handles changes of incorrectAnswers in state
  handleArrayChange = (option, i) => event => {
    let newArray = this.state.incorrectAnswers.slice(0, i)
    newArray.push(event.target.value)
    newArray = newArray.concat(this.state.incorrectAnswers.slice(i + 1))
    this.setState({
      incorrectAnswers: newArray
    })
  }

  removeIncorrectAnswer = () => {
    if (this.state.incorrectAnswers.length > 1) {
      this.setState({
        incorrectAnswers: this.state.incorrectAnswers.slice(0, this.state.incorrectAnswers.length - 1)
      })
    }
  }

  handleSave = () => {
    if (this.state.course === '') {
      console.log('Course is not set!')
    } else if (this.state.groupId === '') {
      console.log('Group is not set!')
    } else if (this.state.questionType === '') {
      console.log('Question Type not set!')
    } else if (this.state.question === '' && this.state.questionType !== 'CompileQuestion') {
      console.log('Question is empty!')
    } else if (this.state.correctAnswer === '') {
      console.log('Correct answer is empty')
    } else if (this.state.incorrectAnswers.includes('')) {
      console.log('Atleast one of incorrect answers are empty')
    } else {
      // If the question is valid
      this.setState({ step: this.state.step + 1 })
      if (this.state.questionType === 'PrintQuestion') {
        this.props.postPrintQuestion(this.state.groupId, this.state.question, this.state.correctAnswer, this.state.incorrectAnswers)
      } else if (this.state.questionType === 'CompileQuestion') {
        this.props.postCompileQuestion(this.state.groupId, this.state.correctAnswer, this.state.incorrectAnswers)
      }
      this.setState({
        course: '',
        groupId: '',
        questionType: '',
        question: '',
        correctAnswer: '',
        incorrectAnswers: ['']
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
    } else if (this.state.step === 2 && this.state.questionType === 'PrintQuestion' && this.state.question === '') {
      notify.show('Kirjoita tulostettava koodi', 'error', 2000)
      return
    } else if (this.state.step === 2 && (this.state.correctAnswer === '' || this.state.incorrectAnswers.includes(''))) {
      notify.show('Ei saa sisältää tyhjiä vastauksia', 'error', 2000)
      return
    }
    this.setState({ step: this.state.step + 1 })
    question.kind = this.state.questionType
    question.item.value = this.state.question
    if (this.state.step > 1) {
      question.item.options = this.state.incorrectAnswers.concat(this.state.correctAnswer)
    }
  }

  render() {
    const { step } = this.state
    let questionTypeSelected = false
    if (this.state.questionType === 'PrintQuestion') {
      questionTypeSelected = true
    }

    const possibleCourses = this.props.courses.filter(obj => { return obj.name === this.state.course })
    const selectedCourse = (possibleCourses.length > 0 ? possibleCourses[0] : { groups: [] })

    return (
      <div className='questionFormContainer'>

        <Notifications ref={this.notificationRef} />

        <form noValidate autoComplete="off" className='questionForm'>

          {step === 3 && (<DumbQuestion question={question} />)}

          {step === 0 && (
            <React.Fragment>
              <h2>Valitse kurssi</h2>
              <InputLabel style={{ fontSize: 13 }}>Kurssi</InputLabel>
              <Select
                fullWidth
                value={this.state.course}
                onChange={this.handleChange('course')}
                style={{marginBottom: '10px'}}
              >
                {this.props.courses.map(course => (
                  <MenuItem key={course.name} value={course.name}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
              {(this.state.course !== '') ?
                (<div>
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
                ) : null
              }
            </React.Fragment>
          )}

          {step === 1 && (
            <React.Fragment>
              <h2>Valitse tyyppi</h2>
              <InputLabel style={{ fontSize: 13 }}>Kysymystyyppi</InputLabel>
              <Select
                fullWidth
                value={this.state.questionType}
                onChange={this.handleChange('questionType')}
              >
                {questionTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </React.Fragment>
          )}

          {step === 2 && (
            <React.Fragment>
              {questionTypeSelected ?
                (<TextField
                  label='Koodisi'
                  multiline
                  fullWidth
                  rowsMax='6'
                  value={this.state.question}
                  onChange={this.handleChange('question')}
                  className='questionField'
                  helperText='Kirjoita tähän koodisi'
                  margin='normal'
                />
                ) : <h2>Valitse mikä koodeista kääntyy</h2>
              }

              <TextField
                label='Oikea vastaus'
                multiline
                fullWidth
                rowsMax='6'
                value={this.state.correctAnswer}
                onChange={this.handleChange('correctAnswer')}
                className='rightAnswerField'
                helperText='Kirjoita oikea vastaus kysymyksellesi, vastaukset saavat sisältää monta riviä'
                margin='normal'
              />

              {this.state.incorrectAnswers.map((option, i) => (
                <TextField
                  key={i}
                  label='Väärä vastaus'
                  multiline
                  fullWidth
                  rowsMax='6'
                  value={option}
                  onChange={this.handleArrayChange(option, i)}
                  className='wrongAnswerField'
                  helperText='Kirjoita jokin väärä vastaus kysymyksellesi, lisää vääriä vastauksia painamalla +'
                  margin='normal'
                />
              ))}

              <div className='addButtonContainer'>
                <Button onClick={this.addIncorrectAnswer} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
                  <AddIcon className='addIcon' />
                </Button>
              </div>
              <div className='removeButtonContainer'>
                <Button onClick={this.removeIncorrectAnswer} variant="fab" mini color="secondary" aria-label="Delete" className='deleteButton'>
                  <DeleteIcon className='deleteIcon' />
                </Button>
              </div>
            </React.Fragment>
          )}
        </form>

        {step === 4 && (
          <div className='rerouteButtonContainer'>
            <Button onClick={() => this.setState({ step: 0 })} variant='contained' color='primary'>
              Uusi kysymys
            </Button>
          </div>
        )}

        <div className='stepContainer'>
          <Steps disabled current={this.state.step} steps={['Valitse kurssi', 'Valitse tyyppi', 'Täytä kentät', 'Tallenna']} />
          <div className='stepperButtonContainer' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button disabled={this.state.step < 1 || this.state.step > 3} onClick={() => this.setState({ step: this.state.step - 1 })} variant="contained" className='backwardButton'>
                {<ArrowBackward className='backwardIcon' />}
                Back
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={() => this.props.history.push('/courses')} color="primary">
                Etusivu
              </Button>
            </div>
            <div>
              {step >= 3 ?
                (<Button disabled={this.state.step > 3} color='primary' onClick={() => this.handleSave()} variant="contained" className='saveButton'>
                  Save
                  {<SaveIcon className='saveIcon' />}
                </Button>
                )
                :
                (<Button style={{ float: 'right' }} onClick={() => this.stepForward()} variant="contained" className='forwardButton'>
                  Next
                  {<ArrowForward className='forwardIcon' />}
                </Button>
                )
              }
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
  fetchCourses
}

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses
  }
}

const ConnectedQuestionForm = connect(mapStateToProps, mapDispatchToProps)(QuestionForm)

export default ConnectedQuestionForm
