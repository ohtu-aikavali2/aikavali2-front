import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import './common.css'

class SelectBox extends Component {
  determineCardStyle = (selected) => {
    return (selected
      ? {
        background: '#3f51b5',
        textColor: 'white'
      } : {
        background: 'white',
        textColor: 'black'
      }
    )
  }

  render() {
    const { content, onClick, selected } = this.props
    const style = this.determineCardStyle(selected)
    return (
      <div className='clickbox'>
        <div className='clickbox-link' onClick={onClick}>
          <Card style={{ background: style.background }} className='clickbox-container'>
            <CardContent style={{ color: style.textColor }}>
              {content}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

export default SelectBox