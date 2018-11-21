import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'

export const CompileQuestion = ({ question, handleSelect, handleSkip, selected, dumb, topLeftContent, topRightContent }) => {
  return (
    <div className='compileQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        Valitse mikä koodinpätkä kääntyy
      </Typography>
      <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleSkip={handleSkip} selected={selected && selected.value === option} dumb={dumb} />)}
    </div>
  )
}

export default CompileQuestion
