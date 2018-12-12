import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import './common.css'

export const ButtonAppBar = (props) => {

  const redirect = (path) => {
    const location = props.history.location.pathname
    // Only if not already there
    if (path !== location && path !== `${location}/`) {
      props.history.push(path)
    }
  }

  return (
    <div className='appBar'>
      <div>
        <AppBar position='static' className='appBar_material'>
          <Toolbar className='toolbar_material'>
            {props.user && (
              <div className='appBarMenuButton'>
                <IconButton onClick={props.toggleDrawer} className='appBar_menu_button' color='inherit' aria-label='Menu'>
                  <MenuIcon className='menuicon_material' />
                </IconButton>
              </div>
            )}
            <div className='appBarTitle'>
              {(props.user && props.user.administrator)
                ? (
                  <Button style={{ color: 'white' }} onClick={() => redirect('/admin')}>
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
