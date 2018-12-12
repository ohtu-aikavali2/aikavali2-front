import React, { Component } from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

class Course extends Component {
  render () {
    const { title, onClick, imageSrc, description } = this.props
    return (
      <div className='course-container'>
        <Card className='course' onClick={onClick}>
          <CardActionArea className='course-action-area'>
            <CardMedia
              component='img'
              className='course-media'
              image={imageSrc}
            />
            <CardContent>
              <Typography gutterBottom variant='headline'>
                {title}
              </Typography>
              <Typography component='p'>
                {description}
              </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
          </CardActionArea>
        </Card>
      </div>
    )
  }
}

export default Course
