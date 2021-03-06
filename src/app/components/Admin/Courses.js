import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { fetchCourses, createCourse } from '../../reducers/actions/courseActions'
import Notifications, { notify } from 'react-notify-toast'
import Course from './Course'

class Courses extends Component {
  state = {
    name: '',
    imageSrc: '',
    description: '',
    step: 'add'
  }

  componentDidMount() {
    this.props.fetchCourses()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    //do validation here
    if (!this.state.name.trim()) {
      notify.show('Lisää kurssille nimi', 'error', 3000)
    } else if (!this.state.description.trim()) {
      notify.show('Lisää kurssille kuvaus', 'error', 3000)
    } else {
      this.props.createCourse(this.state)
      notify.show(`Uusi kurssi '${this.state.name}' luotu`, 'success', 2000)
      this.setState({
        name: '',
        imageSrc: '',
        description: '',
        step: 'edit'
      })
    }
  }

  handleChange = (e) => {
    e.preventDefault()
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState((prevState) => ({ ...prevState, ...newState }))
  }

  toggleView = () => {
    this.setState({
      step: this.state.step === 'add' ? 'edit' : 'add'
    })
  }

  render() {
    const { courses, loggedUser } = this.props
    const { name, imageSrc, description } = this.state
    return (
      <div className='admin-courses'>
        <Notifications ref={this.notificationRef} />
        {this.state.step === 'add' && (
          <div>
            <Button color='primary' variant='contained' onClick={() => this.toggleView()}>
              Kaikki kurssit
            </Button>
            <h1>Lisää kurssi</h1>
            <form onSubmit={this.handleSubmit}>
              <TextField
                name='name'
                id='name'
                label='Nimi'
                type='text'
                fullWidth
                value={name}
                onChange={this.handleChange}
              />
              <TextField
                name='imageSrc'
                id='imageSrc'
                label='Kuva'
                type='text'
                fullWidth
                value={imageSrc}
                onChange={this.handleChange}
              />
              <TextField
                name='description'
                id='description'
                label='Kuvaus'
                type='text'
                fullWidth
                multiline
                rows={3}
                value={description}
                onChange={this.handleChange}
              />
              <Button style={{ marginTop: '10px' }} color='primary' type='submit' variant='contained'>Tallenna</Button>
            </form>
          </div>
        )}
        {this.state.step === 'edit' && (
          <div>
            <Button color='primary' variant='contained' onClick={() => this.toggleView()}>
              Lisää kurssi
            </Button>
            <h1>Kaikki kurssit</h1>
            {courses.map((c, i) => <Course key={i} course={c} loggedUser={loggedUser} />)}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  courses: state.course.courses
})

const mapDispatchToProps = {
  fetchCourses,
  createCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses)