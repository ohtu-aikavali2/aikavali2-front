import React, { Component } from 'react'
import ClickBox from '../common/ClickBox'

class FlaggedQuestions extends Component {

  redirect = (path) => {
    this.props.history.push(path)
  }
  render () {
    return (
      <div className='flaggedQuestionsContainer'>
        <ClickBox title={'Kaikki ilmiannetut kysymykset'} onClick={() => console.log('waiting for implementation')} />
        <ClickBox title={'Ilmiannetut kysymykset kursseittain'} onClick={() => this.redirect('/admin/flags/courses')} />
      </div>
    )
  }
}

export default FlaggedQuestions
