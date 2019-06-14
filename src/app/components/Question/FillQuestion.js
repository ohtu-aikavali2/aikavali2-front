import React from 'react'
import FillInQuestionAnswer from './FillQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const FillInQuestion = ({ question, topLeftContent, topRightContent, answered }) => {

  return (
    <div className='fillInQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          {/* <h4>{question.value}</h4> */}
          <p>Täydennä teksti</p>
        </div>
      </div>
      {question.options.map((option, i) => <FillInQuestionAnswer key={i} value={option} id={question._id} />)}
    </div>
  )
}

export default FillInQuestion
