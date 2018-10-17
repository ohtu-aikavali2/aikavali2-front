import React from 'react'
// import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
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

const PrintQuestion = ({ question, handleSelect, handleConfirm, handleSkip, selected }) => {
  return (
    <div className='printQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        {question.value}
      </Typography>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleConfirm={handleConfirm} handleSkip={handleSkip} selected={selected && selected.value === option} />)}
    </div>
  )
}

PrintQuestion.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PrintQuestion)
