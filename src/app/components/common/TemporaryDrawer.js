import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}

const TemporaryDrawer = (props) => {
  const { classes } = props

  const sideList = (
    <div className={classes.list}>
      <List>list</List>
      <Divider />
      <List>otherList</List>
    </div>
  )

  return (
    <div className='temporaryDrawer'>
      <Drawer open={props.isOpen} onClose={props.toggleDrawer} className='drawer'>
        <div
          className='container'
          tabIndex={0}
          role="button"
        >
          {sideList}
        </div>
      </Drawer>
    </div>
  )
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TemporaryDrawer)