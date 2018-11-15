import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ForwardIcon from '@material-ui/icons/Forward'
import ListAltIcon from '@material-ui/icons/ListAlt'

export const styles = {
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    paddingBottom: 35,
    backgroundColor: 'white'
  },
  middleIcon: {
    width: 40,
    height: 40,
    paddingTop: 20
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

  handleChange = (value) => {
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
        <BottomNavigationAction style={styles.activeButton} label="Kurssit" icon={<ListAltIcon style={styles.middleIcon} />} component={Link} to={'/courses'}/>
        <BottomNavigationAction style={nextStyle} disabled={nextDisabled} onClick={this.props.handleSkip} label="Seuraava" icon={<ForwardIcon style={styles.icon} />} />
      </BottomNavigation>
    )
  }
}

export default ButtonBar