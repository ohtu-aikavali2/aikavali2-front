import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'
import Loading from '../common/Loading'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

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

export class DragAndDropAnswer extends Component {
  handleClick = () => {
    this.props.handleSelect(this.props.value)
  }

  render() {
    const { classes, value, answering, dumb } = this.props
    const answer_lines = '```\n' + value + ''
    return (
      <div className={classes.wrapper} style={{ cursor: 'default'}} id='container' onClick={dumb ? null : this.handleClick}>
        <Card className={classes.paper} id='paper'>
          <CardContent>
            <Grid container wrap="nowrap" spacing={16} className='containerGrid'>
              <Grid item className='itemGrid'>
                <ReactMarkdown source={answer_lines} />
              </Grid>
              <Grid item style={{ position: 'absolute', right: 0 }}>
                <IconButton aria-label="add" onClick={() => this.handleClick()}>
                  <AddIcon/>
                </IconButton>
              </Grid>
            </Grid>
            {answering && <Loading className='answerLoading' bar />}
          </CardContent>
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

export default connect(mapStateToProps)(withStyles(styles)(DragAndDropAnswer))