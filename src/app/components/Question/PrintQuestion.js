import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const PrintQuestion = ({ question, handleSelect, handleSkip, selected, dumb, topLeftContent, topRightContent, answered, correctAnswer, kind }) => {

  return (
    <div className='printQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        {kind === 'GeneralQuestion' && 'Mitä koodi tulostaa?'}
      </Typography>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <h4>{question.value}</h4>
        </div>
      </div>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleSkip={handleSkip} selected={selected && selected.value === option} dumb={dumb} correctAnswer={correctAnswer} />)}
    </div>
  )
}

export default PrintQuestion
