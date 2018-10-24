import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HomeIcon from '@material-ui/icons/Home'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ForwardIcon from '@material-ui/icons/Forward'

const styles = {
  style: {
    width: '100%',
    position: 'fixed',
    bottom: 10,
    backgroundColor: 'white'
  },

  icon: {
    width: 40,
    height: 40
  }
}

class ButtonBar extends Component {
  state = {
    value: 0
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.style}
      >
        <BottomNavigationAction disabled={this.props.showNext || this.props.noMoreQuestions} onClick={this.props.handleSkip} label="Ohita" icon={<SkipNextIcon className={classes.icon}/>}/>
        <BottomNavigationAction label="Koti" icon={<HomeIcon className={classes.icon}/>} />
        <BottomNavigationAction disabled={!this.props.showNext || this.props.noMoreQuestions} onClick={this.props.handleSkip} label="Seuraava" icon={<ForwardIcon className={classes.icon}/>}/>
      </BottomNavigation>
    )
  }
}

ButtonBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ButtonBar)