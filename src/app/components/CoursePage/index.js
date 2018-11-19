import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import Course from '../common/ClickBox'
import './coursePage.css'

export class CoursePage extends Component {

  componentDidMount() {
    this.props.fetchCourses()
  }
  redirect = (path) => {
    this.props.history.push(path)
  }

  render() {
    const { courses } = this.props
    return (
      <div className='course-page'>
        {courses && courses.map(course => (
          <Course key={course.name} title={course.name} onClick={() => this.redirect(`/courses/${course.name}`)} />
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
