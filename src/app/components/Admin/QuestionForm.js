import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'

const styles = {
  questionField: {
    margin: 2,
    width: 250
  },
  questionType: {
    margin: 2,
    width: 250
  },
  saveButton: {
    margin: 5,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  addButton: {
    margin: 5
  }
}

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
      <div className='mainContainer'>
        <form noValidate autoComplete="off" className='form'>
          <TextField
            select
            label="Question type"
            className='questionType'
            style={styles.questionType}
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
            rowsMax="4"
            value={this.state.question}
            onChange={this.handleChange('question')}
            className='questionField'
            style={styles.questionField}
            margin="normal"
          />
          <TextField
            label="Right Answer"
            multiline
            rowsMax="4"
            value={this.state.rightAnswer}
            onChange={this.handleChange('rightAnswer')}
            className='rightAnswerField'
            style={styles.questionField}
            margin="normal"
          />
          <TextField
            label="Wrong Answer"
            multiline
            rowsMax="4"
            value={this.state.wrongAnswer}
            onChange={this.handleChange('wrongAnswer')}
            className='wrongAnswerField'
            style={styles.questionField}
            margin="normal"
          />
          <Button onClick={this.handleAdd} variant="fab" mini color="primary" aria-label="Add" className='addButton' style={styles.addButton}>
            <AddIcon className='addIcon' />
          </Button>
          <Button onClick={this.handleSave} variant="contained" className='saveButton' style={styles.saveButton}>
            Save
            <SaveIcon className='saveIcon' />
          </Button>
        </form>
      </div>
    )
  }
}

export default QuestionForm