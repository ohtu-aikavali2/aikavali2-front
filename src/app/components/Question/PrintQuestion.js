import React from 'react'
import QuestionAnswer from './QuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const PrintQuestion = ({ question, handleSelect, dumb, topLeftContent, topRightContent, answered, selectedList, selectCount }) => {

  return (
    <div className='printQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <h4>{question.value}</h4>
          {selectCount === 'selectOne' ? <p>Valitse oikea vastaus</p> : <p>Valitse kaikki oikeat</p>}
        </div>
      </div>
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} selectedList={selectedList} dumb={dumb} selectCount={selectCount} />)}
    </div>
  )
}

export default PrintQuestion
