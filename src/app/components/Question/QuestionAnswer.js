import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'
import Loading from '../common/Loading'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'

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

export class QuestionAnswer extends Component {

  handleClick = () => {
    const { id, value, userAnswer, selected } = this.props
    if (!userAnswer) {
      this.props.handleSelect(id, value)
    } else if ((userAnswer && userAnswer.correctAnswer === value) || (selected && userAnswer.isCorrect)) {
      this.props.handleSkip()
    } else {
      console.log('Vastasit jo!')
    }
  }

  determineStyle = () => {
    const { userAnswer, value, selected, correctAnswer } = this.props
    const selectedStyle = { backgroundColor: 'rgb(230, 243, 255)', cursor: 'default' }
    const correctStyle = { backgroundColor: 'rgb(113, 218, 113)' }
    const wrongStyle = { backgroundColor: 'rgb(255, 128, 128)', cursor: 'default' }
    const notSelectedWrongStyle = { cursor: 'default' }
    if ((userAnswer && userAnswer.isCorrect && selected) || correctAnswer === value) {
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

  determineAnswerIcon = () => {
    const { userAnswer, value, selected, correctAnswer } = this.props
    const checkMark = 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
    const cross = 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
    if ((userAnswer && userAnswer.isCorrect && selected) || correctAnswer === value) {
      return checkMark
    } else if (userAnswer && userAnswer.correctAnswer === value) {
      return checkMark
    } else if (selected && userAnswer && !userAnswer.isCorrect) {
      return cross
    } else if (selected && !userAnswer) {
      return ''
    } else if (userAnswer && userAnswer.correctAnswer !== value) {
      return ''
    }
  }

  render() {
    const { classes, value, userAnswer, selected, answering, dumb } = this.props
    const style = this.determineStyle()
    const textStyle = {}
    if (answering || (!selected && userAnswer && userAnswer.correctAnswer !== value)) {
      textStyle['color'] = 'grey'
    }

    const answer_lines = '```\n' + value + ''

    return (
      <div className={classes.wrapper} style={{ cursor: dumb ? 'default' : 'pointer' }} id='container' onClick={dumb ? null : this.handleClick}>
        <Card className={classes.paper} id='paper' style={style}>
          <CardActionArea style={{ width: '100%' }}>
            <CardContent>
              <Grid container wrap="nowrap" spacing={16} className='containerGrid'>
                <Grid style={textStyle} item className='itemGrid'>
                  <svg style={{ width: '24px', height: '24px', viewBox: '0 0 24 24', float: 'left', padding: '10px' }}>
                    <path fill="#000000" d={this.determineAnswerIcon()} />
                  </svg>
                  <ReactMarkdown source={answer_lines} />
                </Grid>
              </Grid>
              {answering && selected && <Loading className='answerLoading' bar />}
            </CardContent>
          </CardActionArea>
        </Card>
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

export default connect(mapStateToProps)(withStyles(styles)(QuestionAnswer))
