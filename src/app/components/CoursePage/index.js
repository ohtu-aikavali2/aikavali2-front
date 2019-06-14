import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import Course from './Course'
import Loading from '../common/Loading'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import './coursePage.css'

export class CoursePage extends Component {

  componentDidMount() {
    this.props.fetchCourses()
  }
  redirect = (path) => {
    this.props.history.push(path)
  }

  render() {
    const { courses, coursesLoading } = this.props
    return (
      <div className='course-page'>
        <div className='addNewCourseButton' style={{ padding: '20px' }}>
          <Button color='primary' variant='contained' style={{ color: 'white', paddingLeft: '20px' }} onClick={() => this.redirect('/newcourse')}>
            <AddIcon />
            LISÄÄ UUSI KURSSI
          </Button>
        </div>
        <div>
          {coursesLoading && <Loading />}
          {courses && courses.map(course => (
            <Course
              key={course.name}
              title={course.name}
              onClick={() => this.redirect(`/courses/${course._id}`)}
              imageSrc={course.imageSrc}
              description={course.description}
            />
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses,
    coursesLoading: state.course.coursesLoading
  }
}

const mapDispatchToProps = {
  fetchCourses
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage)
