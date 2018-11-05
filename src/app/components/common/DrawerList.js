import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

export const DrawerList = () => {
  return (
    <div className='drawerList'>
      <List>
        <ListItem button onClick={() => console.log('OHPE')}>
          <ListItemText primary="OHPE" />
        </ListItem>
        <Divider />
        <ListItem button disabled>
          <ListItemText primary="OHJA" />
        </ListItem>
        <Divider />
        <ListItem button disabled>
          <ListItemText primary="TITO" />
        </ListItem>
        <Divider />
        <ListItem button disabled>
          <ListItemText primary="TIKAPE" />
        </ListItem>
        <Divider />
      </List>
    </div>
  )
}

export default DrawerList