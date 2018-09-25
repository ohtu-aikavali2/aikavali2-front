import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  textField: {
    margin: theme.spacing.unit,
    width: 250
  }
})

const questionTypes = [
  {
    value: 'equals',
    label: '='
  },
  {
    value: 'less than',
    label: '<'
  },
  {
    value: 'more than',
    label: '>'
  }
]

class QuestionForm extends React.Component {
  state = {
    questionType: 'equals',
    question: '',
    answer: ''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  };

  render() {
    const { classes } = this.props

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="select-question-type"
          select
          label="Question type"
          className={classes.textField}
          value={this.state.questionType}
          onChange={this.handleChange('questionType')}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin="normal"
        >
          {questionTypes.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="standard-multiline-flexible"
          label="Question"
          multiline
          rowsMax="4"
          value={this.state.question}
          onChange={this.handleChange('question')}
          className={classes.textField}
          margin="normal"
        />
      </form>
    )
  }
}

QuestionForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(QuestionForm)