import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses} from '../../reducers/actions/courseActions'
import ClickBox from '../common/ClickBox'

class Courses extends Component {
  state = {
    step: 0,
    concept: '',
    selectedCourse: ''
  }

  componentDidMount() {
    this.props.fetchCourses()
  }

  handleClick = (course) => {
    return () => {
      this.setState({
        step: this.state.step + 1,
        selectedCourse: course
      })
    }
  }

  render() {
    const step = this.state.step
    const { courses } = this.props
    return (
      <div>
        {step === 0 && (
          <React.Fragment>
            <h2>Valitse kurssi</h2>
            {courses.map(course => <ClickBox key={course._id} title={course.name} onClick={this.handleClick(course)}/>)}
          </React.Fragment>
        )}
        {step === 1 && (
          <React.Fragment>
            <h2>Kurssin {this.state.selectedCourse.name} käsitteet</h2>
            <ul>
              {this.state.selectedCourse.concepts.map(concept =>
                <li key = {concept._id}>{concept.name}</li>
              )}
            </ul>
          </React.Fragment>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  courses: state.course.courses
})

const mapDispatchToProps = {
  fetchCourses
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses)