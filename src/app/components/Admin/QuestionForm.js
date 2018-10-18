import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import './admin.css'

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

class QuestionForm extends Component {
  constructor() {
    super()
    this.state = {
      questionType: '',
      question: '',
      correctAnswer: '',
      incorrectAnswers: ['', '', '']
    }
  }

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

  handleArrayChange = (option, i) => event => {
    let newArray = this.state.incorrectAnswers.slice(0, i)
    newArray.push(event.target.value)
    newArray = newArray.concat(this.state.incorrectAnswers.slice(i + 1))
    console.log(newArray)
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
    console.log('Save pressed')
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

export default QuestionForm