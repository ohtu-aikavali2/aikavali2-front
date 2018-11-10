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
import './admin.css'

import { postCompileQuestion, postPrintQuestion } from '../../reducers/actions/questionActions'

//toistaiseksi tyypit kovakoodattu
const questionTypes = [
  {
    value: 'kääntyy',
    label: 'valitse mikä koodeista kääntyy'
  },
  {
    value: 'tulostaa',
    label: 'valitse mitä koodi tulostaa'
  }
]

export class QuestionForm extends Component {
  constructor() {
    super()
    this.state = {
      questionType: '',
      question: '',
      correctAnswer: '',
      incorrectAnswers: ['', '', '']
    }
  }

  //handles change of questionType, question and correctAnswer in state
  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value
    })
  }
  addIncorrectAnswer = () => {
    this.setState({
      incorrectAnswers: [...this.state.incorrectAnswers, '']
    })
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
    this.setState({
      incorrectAnswers: this.state.incorrectAnswers.slice(0, this.state.incorrectAnswers.length - 1)
    })
  }

  handleSave = () => {
    if (this.state.questionType === '') {
      console.log('Question Type not set!')
    } else if (this.state.question === '' && this.state.questionType !== 'kääntyy') {
      console.log('Question is empty!')
    } else if (this.state.correctAnswer === '') {
      console.log('Correct answer is empty')
    } else if (this.state.incorrectAnswers.includes('')) {
      console.log('Atleast one of incorrect answers are empty')
    } else {
      // If the question is valid
      if (this.state.questionType === 'tulostaa') {
        this.props.postPrintQuestion(this.state.question, this.state.correctAnswer, this.state.incorrectAnswers)
      } else if (this.state.questionType === 'kääntyy') {
        this.props.postCompileQuestion(this.state.correctAnswer, this.state.incorrectAnswers)
      }
      this.setState({
        questionType: '',
        question: '',
        correctAnswer: '',
        incorrectAnswers: ['', '', '']
      })
      console.log('Post succesful')
      this.props.history.push('/admin')
    }
  }

  render() {
    let questionTypeSelected = false
    if (this.state.questionType === 'tulostaa') {
      questionTypeSelected = true
    }

    return (
      <div className='questionFormContainer'>
        <form noValidate autoComplete="off" className='form'>
          <InputLabel style={{ fontSize: 13 }}>Question type</InputLabel>
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
          {questionTypeSelected ?
            (<TextField
              label="Question"
              multiline
              fullWidth
              rowsMax="6"
              value={this.state.question}
              onChange={this.handleChange('question')}
              className='questionField'
              margin="normal"
            />
            ) : null
          }

          <TextField
            label='Correct Answer'
            multiline
            fullWidth
            rowsMax="6"
            value={this.state.correctAnswer}
            onChange={this.handleChange('correctAnswer')}
            className='rightAnswerField'
            margin="normal"
          />

          {this.state.incorrectAnswers.map((option, i) => (
            <TextField
              key={i}
              label='Incorrect Answer'
              multiline
              fullWidth
              rowsMax="6"
              value={option}
              onChange={this.handleArrayChange(option, i)}
              className='wrongAnswerField'
              margin="normal"
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
          <div className='saveButtonContainer'>
            <Button onClick={this.handleSave} variant="contained" className='saveButton'>
              Save
              <SaveIcon className='saveIcon' />
            </Button>
          </div>
        </form>
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
