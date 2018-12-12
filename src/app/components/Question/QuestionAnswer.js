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
    const wrongStyle = { backgroundColor: 'rgb(255, 128, 128)', cursor: 'default'}
    const notSelectedWrongStyle = {cursor: 'default'}
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

  render () {
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
                  <ReactMarkdown source={answer_lines} />
                </Grid>
              </Grid>
              {answering && selected && <Loading className='answerLoading' bar />}
            </CardContent>
          </CardActionArea>
        </Card>
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

export default connect(mapStateToProps)(withStyles(styles)(QuestionAnswer))
