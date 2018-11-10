import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import './common.css'

class ClickBox extends Component {
  render() {
    const { title, onClick } = this.props
    return (
      <div className='clickbox'>
        <div className='clickbox-link' onClick={onClick}>
          <Card onClick={() => console.log(title)} className='clickbox-container'>
            <CardHeader title={title} />
            <CardContent>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }
}

export default ClickBox
