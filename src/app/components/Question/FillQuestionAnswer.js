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
  }
})

export class FillQuestionAnswer extends Component {

  handleTextField = (i) => event => {
    let value = event.target.value
    this.props.handleSelectedList(i, value)
  }

  determineTextFieldStyle = (i) => {
    const { userAnswer, selectedList } = this.props

    const correctStyle = { backgroundColor: 'LightGreen', width: 100, paddingBottom: 2 }
    const wrongStyle = { width: 100, paddingBottom: 2, backgroundColor: 'Red' }
    let style = {}
    let w = this.props.question.value.replace(/TYHJÄ/g, ' TYHJÄ ').split(' ').filter(c => !!c)
    if (userAnswer) {
      let k = 0
      for (let j = 0; j < w.length; j++) {
        if(w[j] === 'TYHJÄ') {
          w[j] = userAnswer.correctAnswer[k]
          k++
        }
      }
    }

    if (userAnswer && w[i].includes(selectedList[i])) {
      style = correctStyle
    } else if (userAnswer) {
      style = wrongStyle
    }
    return style
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
                <TextField
                  disabled={!!(dumb || userAnswer)}
                  style={this.determineTextFieldStyle(i)}
                  onChange={this.handleTextField(i)}
                />
              </Grid>
            ) : <Grid item key={i}> {word} </Grid>
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
