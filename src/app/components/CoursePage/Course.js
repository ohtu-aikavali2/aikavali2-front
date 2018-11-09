import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { Link } from 'react-router-dom'
//import CardMedia from '@material-ui/core/CardMedia'
import './coursePage.css'

class Course extends Component {
  render() {
    const { title } = this.props
    return (
      <div className='course'>
        <Link className='course-link' to={`courses/${title}`}>
          <Card onClick={() => console.log(this.props.title)} className='course-container'>
            <CardHeader title={this.props.title} />
            <CardContent>
            </CardContent>
            <CardActions>
            </CardActions>
          </Card>
        </Link>
      </div>
    )
  }
}

export default Course
