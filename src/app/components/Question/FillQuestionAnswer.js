import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Loading from '../common/Loading'
import { TextField } from '@material-ui/core'

const styles = theme => ({
  wrapper: {
    maxWidth: '600px',
    margin: '0 auto',
    cursor: 'pointer',
    'user-select': 'none',
    'tap-highlight-color': 'rgba(0,0,0,0)'
  },

  paper: {
    margin: theme.spacing.unit,
    position: 'relative',
    overflow: 'auto'
  },

  inputText: {
    color: 'black'
  },

  svgStyle: {
    width: '24px',
    height: '24px',
    viewBox: '0 0 24 24',
    float: 'left',
    paddingRight: '5px',
    paddingTop: '10px',
    paddingBottom: '10px'
  }
})

export class FillQuestionAnswer extends Component {

  handleTextField = (i) => event => {
    let value = event.target.value
    this.props.handleSelectedList(i, value)
  }

  determineTextFieldCorrectness = (i) => {
    const { userAnswer, selectedList } = this.props
    let w = this.props.question.value.replace(/TYHJÄ/g, ' TYHJÄ ').split(' ').filter(c => !!c)
    if (userAnswer) {
      let k = 0
      for (let j = 0; j < w.length; j++) {
        if (w[j] === 'TYHJÄ') {
          w[j] = userAnswer.correctAnswer[k]
          k++
        }
      }
    }
    if (userAnswer && w[i] && selectedList[i] && w[i].includes(selectedList[i].toUpperCase())) {
      return 'correct'
    } else if (userAnswer) {
      return 'wrong'
    } else {
      return 'default'
    }
  }

  determineTextFieldStyle = (i) => {
    const style = { width: 100, paddingBottom: 2 }
    const correctStyle = { backgroundColor: 'rgb(113, 218, 113)', width: 100, paddingTop: 5, paddingLeft: 5 }
    const wrongStyle = { backgroundColor: 'rgb(255, 128, 128)', width: 100, paddingTop: 5, paddingLeft: 5 }
    const correctness = this.determineTextFieldCorrectness(i)
    if (correctness === 'correct') return correctStyle
    if (correctness === 'wrong') return wrongStyle
    return style
  }

  determineAnswerIcon = (i) => {
    const checkFilled = 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
    const cross = 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
    const correctness = this.determineTextFieldCorrectness(i)
    if (correctness === 'correct') return checkFilled
    if (correctness === 'wrong') return cross
    return ''
  }

  render() {
    const { classes, answering, dumb, userAnswer } = this.props
    let words = this.props.question.value.replace(/TYHJÄ/g, ' TYHJÄ ').split(' ').filter(c => !!c)
    return (
      <div className={classes.wrapper} id='container' style={{ cursor: 'default' }} >
        <Grid container spacing={8} direction="row" alignItems="center">
          {words.map((word, i) =>
            word === 'TYHJÄ' ? (
              <Grid item key={i}>
                {userAnswer && (
                  <svg className={classes.svgStyle}>
                    <path fill="#000000" d={this.determineAnswerIcon(i)} />
                  </svg>
                )}
                <TextField
                  disabled={!!(dumb || userAnswer)}
                  style={this.determineTextFieldStyle(i)}
                  onChange={this.handleTextField(i)}
                  InputProps={{
                    classes: {
                      input: classes.inputText
                    }
                  }}
                />
              </Grid>
            ) : <Grid item key={i}>{word}</Grid>
          )}
        </Grid>
        {answering && <Loading className='answerLoading' bar />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer,
    answering: state.question.answering
  }
}

export default connect(mapStateToProps)(withStyles(styles)(FillQuestionAnswer))
