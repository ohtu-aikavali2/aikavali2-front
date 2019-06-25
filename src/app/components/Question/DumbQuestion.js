import React, { Component } from 'react'
import GeneralQuestion from './GeneralQuestion'

class DumbQuestion extends Component {

  render() {
    const { question, correctAnswer } = this.props
    return (
      <div className='dumbQuestionContainer' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {question && question.kind === 'GeneralQuestion' && <GeneralQuestion question={question.item} handleQuestionReview={null} handleSelect={null} handleSkip={null} selected={null} dumb={true} correctAnswer={correctAnswer} />}
      </div>
    )
  }
}

export default DumbQuestion
