import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'

const CompileQuestion = ({ question }) => {
  return (
    <div>
      <Typography variant="headline" align="center" color="default" gutterBottom>
        Valitse mikä koodinpätkä kääntyy
      </Typography>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} />)}
    </div>
  )
}

export default CompileQuestion