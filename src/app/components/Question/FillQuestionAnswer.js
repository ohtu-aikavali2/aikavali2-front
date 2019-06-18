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
    let t = event.target.value
    this.props.handleSelectedList(i, t)
  }

  render() {
    const { classes, answering, dumb, userAnswer } = this.props
    const words = this.props.question.value.replace(/TYHJÄ/g, ' TYHJÄ ').split(' ')

    return (
      <div className={classes.wrapper} id='container' style={{ cursor: 'default' }} >
        <Grid container spacing={8} direction="row" alignItems="center">
          {words.map((word, i) =>
            word === 'TYHJÄ' ? (
              <Grid item key={i}>
                <TextField
                  disabled={!!(dumb || userAnswer)}
                  style={{ width: 100, paddingBottom: 2 }}
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
