import React from 'react'
import QuestionAnswer from './QuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'

export const PrintQuestion = ({ question, handleSelect, dumb, topLeftContent, topRightContent, answered, kind, selectedList }) => {

  return (
    <div className='printQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        {kind !== 'GeneralQuestion' && 'Mitä koodi tulostaa?'}
      </Typography>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <h4>{question.value}</h4>
          <p>Valitse kaikki oikeat</p>
        </div>
      </div>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} selectedList={selectedList} dumb={dumb} />)}
    </div>
  )
}

export default PrintQuestion
