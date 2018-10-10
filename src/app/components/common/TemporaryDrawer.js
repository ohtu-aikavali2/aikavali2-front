import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

const TemporaryDrawer = (props) => {

  const sideList = (
    <div className='drawerList'>
      <List>One</List>
      <Divider />
      <List>Two</List>
      <Divider />
      <List>Three</List>
      <Divider />
      <List>Four</List>
    </div >
  )

  return (
    <div className='temporaryDrawer'>
      <Drawer open={props.isOpen} onClose={props.toggleDrawer} className='drawer'>
        <div
          className='listContainer'
          tabIndex={0}
          role="button"
        >
          {sideList}
        </div>
      </Drawer>
    </div>
  )
}

export default TemporaryDrawer