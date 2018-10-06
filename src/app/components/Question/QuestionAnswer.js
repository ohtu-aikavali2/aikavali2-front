import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
// import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { answerQuestion } from '../../reducers/actions/questionActions'

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

class QuestionAnswer extends Component {
  handleClick = () => {
    const { id, value } = this.props
    this.props.answerQuestion(id, value)
  }

  render () {
    const { classes, value } = this.props
    return (
      <div className={classes.wrapper} onClick={this.handleClick}>
        <Paper className={classes.paper}>
          <Grid container wrap="nowrap" spacing={16}>
            {/* <Grid item>
              <Avatar>1</Avatar>
            </Grid> */}
            <Grid item>
              <Typography align="center">{value}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

const mapDispatchToProps = {
  answerQuestion
}

QuestionAnswer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(QuestionAnswer))