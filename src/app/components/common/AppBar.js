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
      <div>
        <AppBar position='static' className='appBar_material'>
          <Toolbar className='toolbar_material'>
            <div className='appBarMenuButton'>
              <IconButton onClick={props.toggleDrawer} className='appBar_menu_button' color='inherit' aria-label='Menu'>
                <MenuIcon className='menuicon_material' />
              </IconButton>
            </div>
            <div className='appBarTitle'>
              {(props.user && props.user.administrator)
              ? (
                <Button style={{ color: 'white' }} onClick={() => props.history.push('/admin')}>
                  ADMIN
                </Button>
              ) : (
                <Typography
                  variant={'title'}
                  color='inherit'
                  className='typography'
                >
                  Aikavälikertaus
                </Typography>
              )}
            </div>
            {props.user && (
              <div className='appBarLoginContainer'>
                <Button onClick={() => props.logout()} color='inherit' className='appBar_login_button'>Kirjaudu ulos</Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </div>
  )
}

export default ButtonAppBar
