import React from 'react'

const CompileQuestion = ({ question }) => {
  return (
    <div>
      <h1>COMPILE QUESTION</h1>
      <h2>Mikä seuraavista käänytyy?</h2>
      {question.options.map((option, i) => <p key={i}>{option}</p>)}
    </div>
  )
}

export default CompileQuestion