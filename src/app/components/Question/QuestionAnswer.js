import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
// import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { selectAnswer } from '../../reducers/actions/questionActions'

const styles = theme => ({
  wrapper: {
    maxWidth: '365px',
    margin: '0 auto',
    cursor: 'pointer'
  },

  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
})

export class QuestionAnswer extends Component {
  handleClick = () => {
    const { id, value, userAnswer } = this.props
    if (!userAnswer) {
      this.props.selectAnswer(id, value)
    } else {
      console.log('already answered!')
    }
    // this.props.answerQuestion(id, value)
  }

  determineStyle = () => {
    const { userAnswer, value, selectedAnswer } = this.props
    const selectedStyle = { borderStyle: 'solid', borderWidth: 2 }
    const correctStyle = { borderStyle: 'solid', borderWidth: 2, borderColor: 'green' }
    const wrongStyle = { borderStyle: 'solid', borderWidth: 2, borderColor: 'red' }
    if (userAnswer && userAnswer.isCorrect && selectedAnswer.value === value) {
      return correctStyle
    } else if (userAnswer && userAnswer.correctAnswer === value) {
      return correctStyle
    } else if (selectedAnswer && selectedAnswer.value === value && userAnswer && !userAnswer.isCorrect) {
      return wrongStyle
    } else if (selectedAnswer && selectedAnswer.value === value && !userAnswer) {
      return selectedStyle
    }
    return null
  }

  render () {
    const { classes, value } = this.props
    const style = this.determineStyle()
    // const style = (this.props.selectedAnswer && this.props.selectedAnswer.value === this.props.value) ? { borderStyle: 'solid', borderWidth: 2 } : null
    return (
      <div className={classes.wrapper} id='container' onClick={this.handleClick} style={style}>
        <Paper className={classes.paper} id='paper'>
          <Grid container wrap="nowrap" spacing={16} className='containerGrid'>
            <Grid item className='itemGrid'>
              <Typography className='typography' align="center">{value}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedAnswer: state.question.selectedAnswer,
    userAnswer: state.question.userAnswer
  }
}

const mapDispatchToProps = {
  selectAnswer
}

QuestionAnswer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(QuestionAnswer))