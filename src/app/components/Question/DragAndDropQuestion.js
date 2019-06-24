import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import DragAndDropQuestionAnswer from './DragAndDropQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'
import DraggableAnswerOption from './DraggableAnswerOption'

export const DragAndDropQuestion = ({ question, topLeftContent, topRightContent, answered, selectedList, handleSelect, onDragEnd }) => {

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightgray' : 'white',
    padding: 8,
    width: 600,
    display: 'inline-block'
  })

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
      {selectedList.length < 1 ? '' : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-0">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {selectedList.map((option, i) => (
                  <DraggableAnswerOption key={i} value={option} selectedList={selectedList} index={i} />
                  // <Draggable key={i} draggableId={`draggable-${i}`} index={i} >
                  //   {(provided, snapshot) => (
                  //   <div
                  //     ref={provided.innerRef}
                  //     {...provided.draggableProps}
                  //     {...provided.dragHandleProps}
                  //     style={getItemStyle(
                  //       snapshot.isDragging,
                  //       provided.draggableProps.style
                  //     )}
                  //   >
                  //     <Card>
                  //       {option}
                  //     </Card>
                  //   </div>
                  //   )}
                  // </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

    </div>
  )
}

export default DragAndDropQuestion