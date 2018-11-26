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

const courses = [
  {
    name: 'OHTU'
  },
  {
    name: 'OHJA'
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
      questionType: '',
      question: '',
      correctAnswer: '',
      incorrectAnswers: [''],
      step: 0
    }
  }

  //handles change of questionType, question and correctAnswer in state
  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value
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
    if (this.state.questionType === '') {
      console.log('Question Type not set!')
    } else if (this.state.question === '' && this.state.questionType !== 'CompileQuestion') {
      console.log('Question is empty!')
    } else if (this.state.correctAnswer === '') {
      console.log('Correct answer is empty')
    } else if (this.state.incorrectAnswers.includes('')) {
      console.log('Atleast one of incorrect answers are empty')
    } else {
      // If the question is valid
      if (this.state.questionType === 'PrintQuestion') {
        this.props.postPrintQuestion(this.state.question, this.state.correctAnswer, this.state.incorrectAnswers)
      } else if (this.state.questionType === 'CompileQuestion') {
        this.props.postCompileQuestion(this.state.correctAnswer, this.state.incorrectAnswers)
      }
      this.setState({
        questionType: '',
        question: '',
        correctAnswer: '',
        incorrectAnswers: ['']
      })
      console.log('Post succesful')
      this.props.history.push('/admin')
    }
  }

  stepForward = () => {
    if (this.state.step === 0 && this.state.course === '') {
      notify.show('Valitse kurssi', 'error', 2000)
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

    return (
      <div className='questionFormContainer'>

        <Notifications ref={this.notificationRef} />

        {step >= 3 && (<DumbQuestion question={question} />)}

        <form noValidate autoComplete="off" className='questionForm'>

          {step === 0 && (
            <React.Fragment>
              <h2>Valitse kurssi</h2>
              <InputLabel style={{ fontSize: 13 }}>Kurssi</InputLabel>
              <Select
                fullWidth
                value={this.state.course}
                onChange={this.handleChange('course')}
              >
                {courses.map(option => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
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

        <div className='stepContainer'>
          <Steps disabled current={this.state.step} steps={['Valitse kurssi', 'Valitse tyyppi', 'Täytä kentät', 'Tallenna']} />
          <div className='stepperButtonContainer'>
            <Button disabled={this.state.step < 1 || this.state.step > 3} style={{ float: 'left' }} onClick={() => this.setState({ step: this.state.step - 1 })} variant="contained" className='backwardButton'>
              {<ArrowBackward className='backwardIcon' />}
              Back
            </Button>
            {step >= 3 ?
              (<Button disabled={this.state.step > 3} style={{ float: 'right' }} color='primary' onClick={() => this.stepForward()} variant="contained" className='saveButton'>
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
    )
  }
}

const mapDispatchToProps = {
  postCompileQuestion,
  postPrintQuestion
}

const ConnectedQuestionForm = connect(null, mapDispatchToProps)(QuestionForm)

export default ConnectedQuestionForm
