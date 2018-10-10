import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import './common.css'

export const ButtonAppBar = (props) => {
  return (
    <div className='appBar'>
      <AppBar position='static' className='appBar_material'>
        <Toolbar className='toolbar_material'>
          <div className='appBarMenuButton'>
            <IconButton onClick={props.toggleDrawer} className='appBar_menu_button' color='inherit' aria-label='Menu'>
              <MenuIcon className='menuicon_material' />
            </IconButton>
          </div>
          <div className='appBarTitle'>
            <Typography variant='title' color='inherit' className='typography'>
              Aikavälikertaus
            </Typography>
          </div>
          <div className='appBarLoginButton'>
            <Button onClick={() => console.log('login pressed')} color='inherit' className='appBar_login_button'>Login</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default ButtonAppBar
