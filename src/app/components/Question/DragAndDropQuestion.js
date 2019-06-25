import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import DragAndDropQuestionAnswer from './DragAndDropQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'
import DraggableAnswerOption from './DraggableAnswerOption'

export const DragAndDropQuestion = ({ question, topLeftContent, topRightContent, answered, selectedList, handleSelect, userAnswer, onDragEnd, handleRemove }) => {
  const checkFilled = 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
  const cross = 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'

  const notSelected = question.options.filter(f => !selectedList.includes(f))

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'white' : '',
    margin: '0 auto',
    width: '600px',
    maxWidth: '98%',
    display: 'inline-block',
    paddingBottom: 100
  })

  return (
    <div className='dragAndDropQuestion'>
      {userAnswer && (
        <svg style={{ width: '24px', height: '24px', viewBox: '0 0 24 24', paddingRight: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
          <path fill="#000000" d={userAnswer.isCorrect ? checkFilled : cross} />
        </svg>
      )}
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <Typography variant="title" gutterBottom>
            {question.value}
          </Typography>
        </div>
      </div>
      {notSelected.map((option, i) => <DragAndDropQuestionAnswer key={i} value={option} selectedList={selectedList} handleSelect={handleSelect} dumb={true} />)}
      <Divider variat='middle' style={{ marginTop: '20px', marginBottom: '20px' }}/>
      {selectedList.length < 1 ? '' : (
        <div>
          <Typography variant="title" gutterBottom>
            Valitut palat
          </Typography>
          <Typography variant="body2" gutterBottom>
            Voit muuttaa järjestystä raahaamalla paloja
          </Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-0">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {selectedList.map((option, i) => (
                    <DraggableAnswerOption key={i} value={option} selectedList={selectedList} index={i} handleRemove={handleRemove} />
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

    </div>
  )
}

export default DragAndDropQuestion