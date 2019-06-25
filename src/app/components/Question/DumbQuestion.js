import React, { Component } from 'react'
import GeneralQuestion from './GeneralQuestion'
import FillQuestion from './FillQuestion'
import DragAndDropQuestion from './DragAndDropQuestion'

class DumbQuestion extends Component {

  render() {
    const { question, correctAnswer } = this.props
    return (
      <div className='dumbQuestionContainer' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {question && question.kind === 'GeneralQuestion' && <GeneralQuestion question={question.item} handleQuestionReview={null} handleSelect={null} handleSkip={null} selected={null} dumb={true} correctAnswer={correctAnswer} />}
        {question && question.kind === 'FillInTheBlank' && <FillQuestion question={question.item}  topLeftContent={null} topRightContent={null} answered={null} selectedList={null}  handleSelectedList={null} dumb={true}/>}
        {question && question.kind === 'DragAndDrop' && <DragAndDropQuestion question={question.item} topLeftContent={null} topRightContent={null} answered={null} selectedList={[]} handleSelect={null} userAnswer={null} onDragEnd={null} handleRemove={null} dumb={true} />}
      </div>
    )
  }
}

export default DumbQuestion
