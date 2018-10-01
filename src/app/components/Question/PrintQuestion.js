import React from 'react'

const PrintQuestion = ({ question }) => {
  return (
    <div className='printQuestion'>
      <h1>PRINT QUESTION</h1>
      <h2>{question.value}</h2>
      {question.options.map((option, i) => <p key={i}>{option}</p>)}
    </div>
  )
}

export default PrintQuestion
