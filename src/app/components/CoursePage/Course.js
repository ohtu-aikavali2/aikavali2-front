import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
//import CardMedia from '@material-ui/core/CardMedia'
import './coursePage.css'

export class Course extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='course'>
        <Card onClick={() => console.log(this.props.title)} className='course-container'>
          <CardHeader title={this.props.title} />
          <CardContent>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Course
