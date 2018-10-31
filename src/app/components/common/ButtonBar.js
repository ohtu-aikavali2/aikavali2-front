import React, { Component } from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ForwardIcon from '@material-ui/icons/Forward'
/* import AccountBoxIcon from '@material-ui/icons/AccountBox' */
import './common.css'

export const styles = {
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: 'white'
  },

  icon: {
    width: 40,
    height: 40
  },

  activeButton: {
    color: '#3f51b5'
  },

  disabledButton: {
    color: 'grey'
  }

}
// exported for tests
export class ButtonBar extends Component {

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const skipDisabled = this.props.showNext || this.props.noMoreQuestions
    const nextDisabled = !this.props.showNext || this.props.noMoreQuestions
    const skipStyle = skipDisabled ? styles.disabledButton : styles.activeButton
    const nextStyle = nextDisabled ? styles.disabledButton : styles.activeButton
    return (
      <BottomNavigation
        onChange={this.handleChange}
        showLabels
        style={styles.bottomNav}
      >
        <BottomNavigationAction style={skipStyle} disabled={skipDisabled} onClick={this.props.handleSkip} label="Ohita" icon={<SkipNextIcon style={styles.icon} />} />
        <BottomNavigationAction disabled />
        {/* <BottomNavigationAction style={styles.activeButton} label="Profiili" icon={<AccountBoxIcon style={styles.icon} />} /> */}
        <BottomNavigationAction style={nextStyle} disabled={nextDisabled} onClick={this.props.handleSkip} label="Seuraava" icon={<ForwardIcon style={styles.icon} />} />
      </BottomNavigation>
    )
  }
}

export default ButtonBar