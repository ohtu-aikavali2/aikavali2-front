import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'

function CompileQuestion() {

  return (
    <div>
      <Typography variant="headline" align="center" color="default" gutterBottom>
        Valitse mikä koodinpätkä kääntyy
      </Typography>
      <QuestionAnswer />
      <QuestionAnswer />
      <QuestionAnswer />
    </div>
  )
}

export default CompileQuestion