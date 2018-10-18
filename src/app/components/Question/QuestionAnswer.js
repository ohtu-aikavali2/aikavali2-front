import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
// import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  wrapper: {
    maxWidth: '365px',
    margin: '0 auto',
    cursor: 'pointer',
    'user-select': 'none',
    'tap-highlight-color': 'rgba(0,0,0,0)'
  },

  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
})

export class QuestionAnswer extends Component {
  handleClick = () => {
    const { id, value, userAnswer, selected } = this.props
    if (!userAnswer && !selected) {
      this.props.handleSelect(id, value)
    } else if (!userAnswer && selected) {
      this.props.handleConfirm(id, value)
    } else if ((userAnswer && userAnswer.correctAnswer === value) || (selected && userAnswer.isCorrect)) {
      this.props.handleSkip()
    } else {
      console.log('already answered!')
    }
  }

  determineStyle = () => {
    const { userAnswer, value, selected } = this.props
    const selectedStyle = { backgroundColor: 'rgb(230, 243, 255)' }
    const correctStyle = { backgroundColor: 'rgb(113, 218, 113)' }
    const wrongStyle = { backgroundColor: 'rgb(255, 128, 128)', cursor: 'default'}
    const notSelectedWrongStyle = {cursor: 'default'}
    if (userAnswer && userAnswer.isCorrect && selected) {
      return correctStyle
    } else if (userAnswer && userAnswer.correctAnswer === value) {
      return correctStyle
    } else if (selected && userAnswer && !userAnswer.isCorrect) {
      return wrongStyle
    } else if (selected && !userAnswer) {
      return selectedStyle
    } else if (userAnswer && userAnswer.correctAnswer !== value) {
      return notSelectedWrongStyle
    }
    return null
  }

  render () {
    const { classes, value, userAnswer, selected } = this.props
    const style = this.determineStyle()
    const textStyle = {}
    if (!selected && userAnswer && userAnswer.correctAnswer !== value) {
      textStyle['color'] = 'grey'
    }
    return (
      <div className={classes.wrapper} id='container' onClick={this.handleClick}>
        <Paper className={classes.paper} id='paper' style={style}>
          <Grid container wrap="nowrap" spacing={16} className='containerGrid'>
            <Grid item className='itemGrid'>
              <Typography style={textStyle} className='typography' align="center">{value}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer
  }
}

export default connect(mapStateToProps)(withStyles(styles)(QuestionAnswer))