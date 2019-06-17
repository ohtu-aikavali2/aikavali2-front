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
  handleClick = () => {
    const { id, value, userAnswer } = this.props
    if (!userAnswer) this.props.handleSelect(id, value)
  }

  determineStyle = (selected) => {
    const { userAnswer, value } = this.props
    const selectedStyle = { backgroundColor: 'rgb(230, 243, 255)', cursor: 'default' }
    const correctStyle = { backgroundColor: 'rgb(113, 218, 113)' }
    const wrongStyle = { backgroundColor: 'rgb(255, 128, 128)', cursor: 'default' }
    const checkOutline = 'M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'
    const checkFilled = 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
    const cross = 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
    let style = {
      backgroundStyle: { backgroundColor: '' },
      answerIcon: ''
    }
    if (userAnswer) console.log(userAnswer.correctAnswer)
    if (userAnswer && userAnswer.correctAnswer && userAnswer.correctAnswer.includes(value)) {
      style = {
        backgroundStyle: correctStyle,
        answerIcon: checkFilled
      }
    } else if (userAnswer && userAnswer.correctAnswer && !userAnswer.correctAnswer.includes(value)) {
      style = {
        backgroundStyle: wrongStyle,
        answerIcon: cross
      }
    } else if (selected && !userAnswer) {
      style = {
        backgroundStyle: selectedStyle,
        answerIcon: checkOutline
      }
    }
    return style
  }

  render() {
    const { classes, answering, dumb } = this.props
    // const selected = selectedList ? (selectedList.map(s => s.value).includes(value)) : false
    const spaced = this.props.question.value.replace(/TYHJÄ/g, ' TYHJÄ ')
    const words = spaced.split(' ')

    return (
      <div className={classes.wrapper} id='container' style={{ cursor: 'default' }} >
        <Grid container spacing={8} direction="row" alignItems="center">
          {words.map(word => word === 'TYHJÄ' ? (
            <Grid item>
              <TextField
                key={Math.floor((Math.random() * 100) + 1)}
                label={'Täytä puuttuva sana'}
                disabled={dumb}
                style={{ width: 175, paddingBottom: 20 }}
                onChange={() => this.props.handleSelectedList(['jejejeje'])}
              />
            </Grid>
          ) : <Grid item> {word} </Grid>
          )}
        </Grid>
        {answering && <Loading className='answerLoading' bar />}
      </div >
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
