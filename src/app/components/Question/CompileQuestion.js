import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'

export const CompileQuestion = ({ question, handleSelect, handleSkip, selected, dumb, feedBack }) => {

  return (
    <div className='compileQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        Valitse mikä koodinpätkä kääntyy
      </Typography>
      <div style={{ width: '100%', height: 30 }}>
        <Typography variant="title" align="center" gutterBottom>{feedBack}</Typography>
      </div>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleSkip={handleSkip} selected={selected && selected.value === option} dumb={dumb} />)}
    </div>
  )
}

export default CompileQuestion
