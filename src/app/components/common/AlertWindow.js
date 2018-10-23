import React from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

// Tälle voi nyt määrittää vaikka mitä kivaa propseina tai vaikka children
export const AlertWindow = ({ title, children }) => {

  const style = {
    paddingBottom: '10px',
    paddingTop: '10px',
    maxWidth: '350px',
    margin: '0 auto',
    textAlign: 'center'
  }

  const text = {
    fontSize: 16
  }

  return (
    <div className='alertWindowContainer' style={style}>
      <Card>
        <CardContent>
          <Typography style={text} component="p">{title}</Typography>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default AlertWindow
