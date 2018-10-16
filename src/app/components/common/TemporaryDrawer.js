import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import DrawerList from './DrawerList'

const TemporaryDrawer = (props) => {

  return (
    <div className='temporaryDrawer'>
      <Drawer open={props.isOpen} onClose={props.toggleDrawer} className='drawer'>
        <DrawerList />
      </Drawer>
    </div>
  )
}

export default TemporaryDrawer
