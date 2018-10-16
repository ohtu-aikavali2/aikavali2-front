import React from 'react'
import Typography from '@material-ui/core/Typography'

// Tälle voi nyt määrittää vaikka mitä kivaa propseina tai vaikka children
export const AlertWindow = ({ title, positive, negative, neutral, children }) => {

  const style = {
    paddingBottom: '10px',
    paddingTop: '10px',
    maxWidth: '350px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: positive ? 'rgb(113, 218, 113)' : negative ? 'rgb(255, 128, 128)' : neutral ? 'rgb(230, 243, 255)' : 'white'
  }

  return (
    <div className='alertWindowContainer' style={style}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </div>
  )
}

export default AlertWindow
