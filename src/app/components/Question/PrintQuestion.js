import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import QuestionAnswer from './QuestionAnswer'

const styles = ({
  card: {
    height: '100%',
    width: '350px',
    margin: '0 auto'
  },

  question: {
    width: '350px',
    margin: '0 auto'
  }
})

function PrintQuestion(props) {
  const { classes } = props

  return (
    <div className='printQuestion'>
      <Typography variant="headline" align="center" color="default" gutterBottom>
        Valitse mitä koodinpätkä tulostaa
      </Typography>
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography align="center">
              Koodia koodia koodia
            </Typography>
          </CardContent>
        </Card>
      </div>
      <QuestionAnswer />
      <QuestionAnswer />
      <QuestionAnswer />
    </div>
  )
}

PrintQuestion.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PrintQuestion)