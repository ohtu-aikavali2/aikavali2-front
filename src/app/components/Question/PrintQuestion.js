import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'
import ReactMarkdown from 'react-markdown'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const PrintQuestion = ({ question, handleSelect, handleSkip, selected, dumb, topLeftContent, topRightContent, answered, correctAnswer }) => {
  let source = '```\n'
  question.value.split('\n').forEach((line) => source += line + '\n')
  source += '```'

  return (
    <div className='printQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        {question.type !== 'GeneralQuestion' && 'Mitä koodi tulostaa?'}
      </Typography>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <ReactMarkdown source={source} />
        </div>
      </div>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleSkip={handleSkip} selected={selected && selected.value === option} dumb={dumb} correctAnswer={correctAnswer} />)}
    </div>
  )
}

export default PrintQuestion
