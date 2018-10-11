import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

function DrawerList() {
  return (
    <div className='drawerList'>
      <List>
        <ListItem button component='a' href='/'>
          <ListItemText primary="OHPE" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button disabled component='a' href='/OHJA'>
          <ListItemText primary="OHJA" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button disabled component='a' href='/TITO'>
          <ListItemText primary="TITO" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button disabled component='a' href='/TIKAPE'>
          <ListItemText primary="TIKAPE" />
        </ListItem>
      </List>
    </div>
  )
}

export default DrawerList