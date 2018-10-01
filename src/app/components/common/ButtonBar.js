import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SkipNext from '@material-ui/icons/SkipNext'
import Confirm from '@material-ui/icons/Check'

const styles = {
  buttonLeft: {
    margin: 2,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  buttonRight: {
    margin: 2,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  rightIcon: {
    marginLeft: 10
  }
}

function IconLabelButtons({ classes, handleSkip, handleConfirm }) {
  return (
    <div className='mainContainer'>
      <Button onClick={handleSkip} variant="contained" color="secondary" className='leftButton' style={styles.buttonLeft}>
        Skip
        <SkipNext className={classes.rightIcon} />
      </Button>
      <Button onClick={handleConfirm} variant="contained" color="primary" className='rightButton' style={styles.buttonRight}>
        Confirm
        <Confirm className={classes.rightIcon} />
      </Button>
    </div>
  )
}

IconLabelButtons.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(IconLabelButtons)