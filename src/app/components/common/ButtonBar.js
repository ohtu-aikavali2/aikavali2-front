import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SkipNext from '@material-ui/icons/SkipNext'
import Confirm from '@material-ui/icons/Check'

const styles = theme => ({
  buttonLeft: {
    margin: theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  buttonRight: {
    margin: theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

function IconLabelButtons({ classes, handleSkip }) {
  return (
    <div>
      <Button onClick={handleSkip} variant="contained" color="secondary" className={classes.buttonLeft}>
        Skip
        <SkipNext className={classes.rightIcon} />
      </Button>
      <Button onClick={() => console.log('confirm pressed')} variant="contained" color="primary" className={classes.buttonRight}>
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