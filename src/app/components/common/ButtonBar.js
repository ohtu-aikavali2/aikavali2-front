import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ListAltIcon from '@material-ui/icons/ListAlt'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import ForwardIcon from '@material-ui/icons/Forward'

export const styles = {
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    paddingBottom: 10,
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
    const skipDisabled = this.props.noMoreQuestions
    const skipStyle = skipDisabled ? styles.disabledButton : styles.activeButton
    const skipLabel = this.props.showNext ? 'Seuraava' : 'Ohita'
    const skipIcon = this.props.showNext ? <ForwardIcon style={styles.icon} /> : <SkipNextIcon style={styles.icon} />

    return (
      <BottomNavigation
        onChange={this.handleChange}
        showLabels
        style={styles.bottomNav}
      >
        <BottomNavigationAction style={styles.activeButton} label="Lisää kysymys" icon={<LibraryAddIcon style={styles.middleIcon} />} component={Link} to={'/newquestion'} />
        <BottomNavigationAction style={styles.activeButton} label="Kurssit" icon={<ListAltIcon style={styles.middleIcon} />} component={Link} to={'/courses'} />
        <BottomNavigationAction disabled={skipDisabled} style={skipStyle} onClick={this.props.handleSkip} label={skipLabel} icon={skipIcon} />
      </BottomNavigation>
    )
  }
}

export default ButtonBar