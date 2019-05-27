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

  render() {
    const step = this.state.step
    const { courses } = this.props
    console.log(courses)
    return (
      <div>
        {step === 0 && (
          <React.Fragment>
            <h2>Valitse kurssi</h2>
            {courses.map(course => <ClickBox key={course._id} title={course.name} onClick={() => console.log('painettu')}/>)}
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