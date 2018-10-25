import React from 'react'
import Typography from '@material-ui/core/Typography'
import QuestionAnswer from './QuestionAnswer'
import LikertScale from 'likert-react'

const CompileQuestion = ({ question, handleSelect, handleConfirm, handleSkip, handleQuestionReview, selected, userAnswer }) => {
  const questions = [{question: 'Mitä mieltä olit kysymyksestä?'}]

  return (
    <div className='compileQuestion'>
      <Typography className='typography' variant="headline" align="center" color="default" gutterBottom>
        Valitse mikä koodinpätkä kääntyy
      </Typography>
      {userAnswer && <div className='likertScale'> <LikertScale reviews={questions} onClick={handleQuestionReview} /> </div>}
      {question.options.map((option, i) => <QuestionAnswer key={i} value={option} id={question._id} handleSelect={handleSelect} handleConfirm={handleConfirm} handleSkip={handleSkip} selected={selected && selected.value === option} />)}
    </div>
  )
}

export default CompileQuestion
