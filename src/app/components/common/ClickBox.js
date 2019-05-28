import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import './common.css'

class ClickBox extends Component {
  render() {
    const { title, onClick, style } = this.props
    return (
      <div className='clickbox'>
        <div className='clickbox-link' onClick={onClick}>
          <Card style={style} className='clickbox-container'>
            <CardActionArea style={{ width: '100%' }}>
              <CardHeader title={title} />
              <CardContent>
              </CardContent>
              <CardActions>
              </CardActions>
            </CardActionArea>
          </Card>
        </div>
      </div>
    )
  }
}

export default ClickBox
