import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'

class DumbQuestion extends Component {

  render () {
    const { question } = this.props
    return (
      <div className='dumbQuestionContainer' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {question && question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} handleQuestionReview={null} handleSelect={null} handleSkip={null} selected={null} dumb />}
        {question && question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} handleQuestionReview={null} handleSelect={null} handleSkip={null} selected={null} dumb />}
      </div>
    )
  }
}

export default DumbQuestion
