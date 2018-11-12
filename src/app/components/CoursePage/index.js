import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import Course from '../common/ClickBox'
import { getFlaggedQuestionsByCourse } from '../../reducers/actions/questionActions'
import './coursePage.css'

export class CoursePage extends Component {
  constructor() {
    super()
    this.state = {
      fromAdminPage: false
    }
  }
  componentDidMount() {
    this.props.fetchCourses()
    if (this.props.history.location.pathname === '/admin/flags/courses' || this.props.history.location.pathname === '/admin/flags/courses/') {
      this.setState({
        fromAdminPage: true
      })
    }
  }
  redirect = (path) => {
    this.props.history.push(path)
    if (this.state.fromAdminPage) {
      let words = path.split('/')
      const course = words[words.length - 1]
      this.props.getFlaggedQuestionsByCourse(course)
    }
  }

  render() {
    const { courses } = this.props
    const path = !this.state.fromAdminPage ? '/courses/' : '/admin/flags/courses/'
    return (
      <div className='course-page'>
        {courses && courses.map(course => (
          <Course key={course.name} title={course.name} onClick={() => this.redirect(`${path}${course.name}`)} />
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
  fetchCourses,
  getFlaggedQuestionsByCourse
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage)
