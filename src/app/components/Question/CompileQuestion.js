import React from 'react'

const CompileQuestion = ({ question }) => {
  return (
    <div className='compileQuestion'>
      <h1>COMPILE QUESTION</h1>
      <h2>Mikä seuraavista kääntyy?</h2>
      {question.options.map((option, i) => <p key={i}>{option}</p>)}
    </div>
  )
}

export default CompileQuestion