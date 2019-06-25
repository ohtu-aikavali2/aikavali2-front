import React from 'react'
import GeneralQuestionAnswer from './GeneralQuestionAnswer'
import FeedbackBar from '../common/FeedbackBar'
import Collapse from '@material-ui/core/Collapse'

export const GeneralQuestion = ({ dumb, question, handleSelect, topLeftContent, topRightContent, answered, selectedList, selectCount }) => {

  return (
    <div className='generalQuestion'>
      <Collapse in={answered} timeout={400}>
        <FeedbackBar topLeftContent={topLeftContent} topRightContent={topRightContent} />
      </Collapse>
      <div className='titleContainer'>
        <div className='rowContainer'>
          <h4>{question.value}</h4>
          <p>{selectCount === 'selectOne' ? 'Valitse oikea vastaus' : 'Valitse kaikki oikeat'}</p>
        </div>
      </div>
      {question.options.map((option, i) => <GeneralQuestionAnswer key={i} value={option} id={question._id} dumb={dumb} handleSelect={handleSelect} selectedList={selectedList} selectCount={selectCount} />)}
    </div>
  )
}

export default GeneralQuestion
