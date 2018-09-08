import React, { Component } from 'react'

class Button extends Component {
  render () {
    return (
      <button className='button' onClick={this.props.handleClick}>{this.props.value}</button>
    )
  }
}

export default Button
