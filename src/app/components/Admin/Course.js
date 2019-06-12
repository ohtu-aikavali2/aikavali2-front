import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createGroup } from '../../reducers/actions/groupActions'
import { updateCourse } from '../../reducers/actions/courseActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import CheckIcon from '@material-ui/icons/Check'

class Course extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
      name: '',
      courseName: props.course.name,
      imageSrc: props.course.imageSrc,
      description: props.course.description,
      allowedToEdit: false
    }
  }

  handleChange = (e) => {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState((prevState) => ({ ...prevState, ...newState }))
  }

  handleSubmit = () => {
    const { _id } = this.props.course
    this.props.createGroup({ ...this.state, courseId: _id })
    this.setState({ name: '' })
  }

  toggleEdit = () => {
    const edit = this.state.edit
    if (edit) {
      const { courseName: name, imageSrc, description } = this.state
      const { _id } = this.props.course
      this.props.updateCourse({ name, imageSrc, description }, _id)
    }
    this.setState({ edit: !edit })
  }

  checkAllowedToEdit = (loggedUser, course) => {
    if (loggedUser.administrator === true || course.user === loggedUser.id) {
      return true
    }
    return false
  }

  render() {
    const { course, loggedUser } = this.props
    const { edit, name, imageSrc, description, courseName } = this.state
    const canEdit = this.checkAllowedToEdit(loggedUser, course)
    return (
      <div>
        <div className='course-title-container'>
          {!edit && <h2>{course.name}</h2>}
          {edit && (
            <TextField
              name='courseName'
              id='courseName'
              label='Kurssin nimi'
              type='text'
              value={courseName}
              onChange={this.handleChange}
            />
          )}
          {!edit && canEdit && <IconButton onClick={() => this.toggleEdit()} style={{ marginLeft: '10px' }} color='inherit'><EditIcon /></IconButton>}
          {edit && <IconButton onClick={() => this.toggleEdit()} style={{ marginLeft: '10px' }} color='inherit'><CheckIcon /></IconButton>}
        </div>
        <div className='course-info'>
          {!edit && (
            <React.Fragment>
              <b>Kuva: </b>
              <p>{course.imageSrc}</p>
            </React.Fragment>
          )}
          {edit && (
            <TextField
              name='imageSrc'
              id='imageSrc'
              label='Kuva'
              type='text'
              value={imageSrc}
              fullWidth
              onChange={this.handleChange}
            />
          )}
        </div>
        <div className='course-info'>
          {!edit && (
            <React.Fragment>
              <b>Kuvaus: </b>
              <p>{course.description}</p>
            </React.Fragment>
          )}
          {edit && (
            <TextField
              name='description'
              id='description'
              label='Kuvaus'
              type='text'
              value={description}
              fullWidth
              onChange={this.handleChange}
            />
          )}
        </div>
        <div className='course-groups'>
          <b>Ryhmät:</b>
          <br />
          {course.groups.map((g, j) => {
            return (
              <p key={j}>-{g.name}</p>
            )
          })}
          <div className='group-form'>
            {edit && (
              <React.Fragment>
                <TextField
                  name='name'
                  id='name'
                  label='Nimi'
                  type='text'
                  value={name}
                  onChange={this.handleChange}
                />
                <Button onClick={this.handleSubmit} style={{ marginLeft: '10px' }} variant='contained' color='default'>+</Button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  createGroup,
  updateCourse
}

export default connect(
  null,
  mapDispatchToProps
)(Course)