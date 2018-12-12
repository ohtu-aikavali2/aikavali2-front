import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import Course from './Course'
import Loading from '../common/Loading'
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
        {coursesLoading && <Loading />}
        {courses && courses.map(course => (
          <Course
            key={course.name}
            title={course.name}
            onClick={() => this.redirect(`/courses/${course.name}`)}
            imageSrc={course.imageSrc}
            description={course.description}
          />
        ))}
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
