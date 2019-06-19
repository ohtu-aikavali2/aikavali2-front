import React from 'react'
import FillInQuestionAnswer from './FillQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'
import { Typography } from '@material-ui/core'

export const FillInQuestion = ({ question, topLeftContent, topRightContent, answered, selectedList, handleSelectedList }) => {

  return (
    <div className='fillInQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <Typography variant="title" gutterBottom>
            Täydennä teksti
          </Typography>
        </div>
      </div>
      <FillInQuestionAnswer question={question} handleSelectedList={handleSelectedList} selectedList={selectedList} />
    </div>
  )
}

export default FillInQuestion
