import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import Course from './Course'
import './coursePage.css'

export class CoursePage extends Component {
  componentDidMount() {
    this.props.fetchCourses()
  }

  render() {
    const { courses } = this.props
    return (
      <div className='course-page'>
        {courses !== undefined && courses.map(course => (
          <Course key={course.name} title={course.name} />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses
  }
}

const mapDispatchToProps = {
  fetchCourses
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage)
