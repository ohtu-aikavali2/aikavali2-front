import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({

  wrapper: {
    maxWidth: '365px',
    margin: '0 auto'
  },

  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }

})

function QuestionAnswer(props) {
  const { classes } = props

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.paper}>
        <Grid container wrap="nowrap" spacing={16}>
          <Grid item>
            <Avatar>1</Avatar>
          </Grid>
          <Grid item>
            <Typography align="center">Vastausvaihtoehto</Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

QuestionAnswer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(QuestionAnswer)