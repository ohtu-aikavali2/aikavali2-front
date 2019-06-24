import React from 'react'
import DragAndDropQuestionAnswer from './DragAndDropQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'

export const DragAndDropQuestion = ({ question, topLeftContent, topRightContent, answered, selectedList, handleSelect }) => {
  const notSelected = question.options.filter(f => !selectedList.includes(f))
  console.log(notSelected)
  console.log(selectedList)
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
      {notSelected.map((option, i) => <DragAndDropQuestionAnswer key={i} value={option} selectedList={selectedList} handleSelect={handleSelect} />)}
      <Divider variat='middle' style={{ marginTop: '20px', marginBottom: '20px' }}/>
      {selectedList.map((option, i ) => <DragAndDropQuestionAnswer key={i} value={option} selectedList={selectedList} />)}
    </div>
  )
}

export default DragAndDropQuestion