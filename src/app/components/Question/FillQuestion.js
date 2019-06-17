import React from 'react'
import FillInQuestionAnswer from './FillQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const FillInQuestion = ({ question, topLeftContent, topRightContent, answered, test }) => {

  return (
    <div className='fillInQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <p>Täydennä teksti</p>
        </div>
      </div>
      <FillInQuestionAnswer question={question} test={() => test()} />
    </div>
  )
}

export default FillInQuestion
