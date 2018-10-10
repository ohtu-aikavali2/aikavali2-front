import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'
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
      rightAnswer: '',
      wrongAnswer: ''
    }
  }

  handleChange = (name) => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSave = () => {
    console.log('Save pressed')
  }

  handleAdd = () => {
    console.log('Add pressed')
  }

  render() {
    return (
      <div className='questionFormContainer'>
        <form noValidate autoComplete="off" className='form'>
          <TextField
            select
            fullWidth
            label="Question type"
            className='questionType'
            value={this.state.questionType}
            onChange={this.handleChange('questionType')}
            margin="normal"
          >
            {questionTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Question"
            multiline
            fullWidth
            rowsMax="4"
            value={this.state.question}
            onChange={this.handleChange('question')}
            className='questionField'
            margin="normal"
          />
          <TextField
            label="Right Answer"
            multiline
            fullWidth
            rowsMax="4"
            value={this.state.rightAnswer}
            onChange={this.handleChange('rightAnswer')}
            className='rightAnswerField'
            margin="normal"
          />
          <TextField
            label="Wrong Answer"
            multiline
            fullWidth
            rowsMax="4"
            value={this.state.wrongAnswer}
            onChange={this.handleChange('wrongAnswer')}
            className='wrongAnswerField'
            margin="normal"
          />
          <div className='addButtonContainer'>
            <Button onClick={this.handleAdd} variant="fab" mini color="primary" aria-label="Add" className='addButton'>
              <AddIcon className='addIcon' />
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