import React, { Component } from 'react'
import Slide from '@material-ui/core/Slide'
import Fade from '@material-ui/core/Fade'

class Popup extends Component {
  constructor () {
    super()
    this.state = {
      done: true
    }
  }
  render () {
    const { toggle, children, checked, timeout = 300 } = this.props
    return (
      <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, top: 0, zIndex: this.state.done ? -1 : 1 }}>
        <Fade in={checked} timeout={timeout} onExited={() => this.setState({ done: true })} onEnter={() => this.setState({ done: false })}>
          <div style={{ width: '100%', height: '100%', background: 'rgb(0, 0, 255, 0.2)' }} />
        </Fade>

        <Slide direction='down' in={checked} mountOnEnter unmountOnExit timeout={timeout}>
          <div
            style={{ position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent', width: '100%', height: '100%', zIndex: 4, top: 0, left: 0 }}
            onClick={toggle}
          >
            {children}
          </div>
        </Slide>
      </div>
    )
  }
}

export default Popup
