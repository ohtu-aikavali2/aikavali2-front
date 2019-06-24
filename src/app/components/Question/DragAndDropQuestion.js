import React from 'react'
import DragAndDropQuestionAnswer from './DragAndDropQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'
import { Typography } from '@material-ui/core'

export const DragAndDropQuestion = ({ question, topLeftContent, topRightContent, answered, selectedList }) => {

  return (
    <div className='DragAndDropQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <Typography variant="title" gutterBottom>
            Järjestä palat oikeaan järjestykseen
          </Typography>
        </div>
      </div>
      {question.options.map((option, i) => <DragAndDropQuestionAnswer key={i} value={option} selectedList={selectedList} />)}
    </div>
  )
}

export default DragAndDropQuestion