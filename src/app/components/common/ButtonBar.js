import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SkipNext from '@material-ui/icons/SkipNext'

const styles = {
  buttonLeft: {
    margin: 5,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  buttonRight: {
    margin: 5,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  rightIcon: {
    marginLeft: 10
  }
}

export function ButtonBar ({ handleSkip, showNext }) {
  const text = showNext ? 'Next' : 'Skip'
  return (
    <div className='mainContainer'>
      <Button onClick={handleSkip} variant="contained" color="secondary" className='button' style={showNext ? styles.buttonRight : styles.buttonLeft}>
        {text}
        <SkipNext className='skipIcon' />
      </Button>
    </div>
  )
}

export default withStyles(styles)(ButtonBar)
