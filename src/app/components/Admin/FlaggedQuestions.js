import React, { Component } from 'react'
import FlaggedQuestionsTable from './FlaggedQuestionsTable'

class FlaggedQuestions extends Component {

  render () {
    return (
      <div className='flaggedQuestionsContainer'>
        <FlaggedQuestionsTable />
      </div>
    )
  }
}

export default FlaggedQuestions
