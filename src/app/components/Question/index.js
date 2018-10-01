import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'

class Question extends Component {
  render() {
    const { question } = this.props
    return (
      <div className='questionContainer'>
        {question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} />}
        {question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} />}
      </div>
    )
  }
}

export default Question
