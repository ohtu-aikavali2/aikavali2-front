import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Draggable } from 'react-beautiful-dnd'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'
import Loading from '../common/Loading'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/Button'
import RemoveIcon from '@material-ui/icons/Remove'

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  position: 'relative',
  margin: '0 0 8px 0',

  // change background colour if dragging
  background: isDragging ? 'lightgray' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
})

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

export class DraggableAnswerOption extends Component {
  handleRemove = () => {
    this.props.handleRemove(this.props.value)
  }

  render() {
    const { classes, value, answering, dumb, index } = this.props
    const answer_lines = '```\n' + value + ''
    return (
      <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <div className={classes.wrapper} style={{ cursor: 'default'}} id='container'>
              <Card className={classes.paper} id='paper'>
                <CardContent>
                  <Grid container wrap="nowrap" spacing={16} className='containerGrid'>
                    <Grid item className='itemGrid'>
                      <ReactMarkdown source={answer_lines} />
                    </Grid>
                    <Grid item style={{ position: 'absolute', right: 0 }}>
                      <IconButton aria-label="add" onClick={(dumb || this.props.userAnswer) ? null : this.handleRemove}>
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {answering && <Loading className='answerLoading' bar />}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Draggable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer,
    answering: state.question.answering
  }
}

export default connect(mapStateToProps)(withStyles(styles)(DraggableAnswerOption))