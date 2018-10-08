import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SkipNext from '@material-ui/icons/SkipNext'
import Confirm from '@material-ui/icons/Check'

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

function ButtonBar({ handleSkip, handleConfirm, showNext }) {
  const text = !showNext ? 'Skip' : 'Next'
  return (
    <div className='mainContainer'>
      <Button onClick={handleSkip} variant="contained" color="secondary" className='leftButton' style={!showNext ? styles.buttonLeft : styles.buttonRight}>
        {text}
        <SkipNext className='skipIcon' />
      </Button>
      {!showNext &&
        (
          <Button onClick={handleConfirm} variant="contained" color="primary" className='rightButton' style={styles.buttonRight}>
            Confirm
            <Confirm className='confirmIcon' />
          </Button>
        )
      }
    </div>
  )
}

export default withStyles(styles)(ButtonBar)
