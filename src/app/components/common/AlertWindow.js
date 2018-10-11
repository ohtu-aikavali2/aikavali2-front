import React from 'react'

// Tälle voi nyt määrittää vaikka mitä kivaa propseina tai vaikka children
export const AlertWindow = ({ title, positive, negative, neutral, children }) => {
  return (
    <div className='alertWindowContainer' style={{ textAlign: 'center', backgroundColor: positive ? 'rgb(68, 255, 0, 0.5)' : negative ? 'rgb(255, 0, 0, 0.5)' : neutral ? 'rgb(0, 55, 255, 0.3)' : 'white' }}>
      <p>Tämä on AlertWindow, tänne voi laittaa kaikkee paskaa</p>
      <p>{title}</p>
      {children}
    </div>
  )
}

export default AlertWindow
