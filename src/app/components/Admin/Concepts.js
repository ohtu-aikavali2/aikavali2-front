import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses } from '../../reducers/actions/courseActions'
import conceptService from '../../services/conceptService'
import courseService from '../../services/courseService'
import ClickBox from '../common/ClickBox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './admin.css'

class Concepts extends Component {
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

  handleChange = (name) => e => {
    this.setState({
      [name]: e.target.value
    })
  }

  addConcept = () => {
    const newConcept = {
      name: this.state.concept,
      course: this.state.selectedCourse._id
    }

    conceptService
      .postConcept(newConcept)
      .then(res => {
        const conceptList = this.state.selectedCourse.concepts.concat(res)
        const updatedCourse = {
          ...this.state.selectedCourse,
          concepts: conceptList
        }
        this.setState({
          concept: '',
          selectedCourse: updatedCourse
        })
      })
  }

  removeConcept = (id) => {
    conceptService
      .deleteConcept(id)
      .then(() => {
        courseService
          .getCourse(this.state.selectedCourse._id)
          .then(res => {
            this.setState({
              selectedCourse: res
            })
          })
      })

  }

  render() {
    const step = this.state.step
    const { courses } = this.props
    return (
      <div className='conceptFormContainer'>
        {step === 0 && (
          <React.Fragment>
            <h2>Valitse kurssi</h2>
            {courses.map(course => <ClickBox key={course._id} title={course.name} onClick={this.handleClick(course)} />)}
          </React.Fragment>
        )}
        {step === 1 && (
          <React.Fragment>
            <Grid item xs={12} md={6}>
              <Typography variant="title">
                Kurssin {this.state.selectedCourse.name} käsitteet
              </Typography>
              <div>
                <List dense={false}>
                  {this.state.selectedCourse.concepts.map(
                    concept =>
                      (
                        <ListItem key={concept._id}>
                          <ListItemText
                            primary={concept.name}
                          />
                          <div className='removeButtonContainer'>
                            <Button onClick={() => this.removeConcept(concept._id)} variant="fab" mini color="secondary" aria-label="Delete" className='deleteButton'>
                              <DeleteIcon className='deleteIcon' />
                            </Button>
                          </div>
                        </ListItem>
                      )
                  )}
                </List>
              </div>
            </Grid>
            <form>
              <TextField
                label='Lisää uusi käsite kursille'
                fullWidth
                value={this.state.concept}
                onChange={this.handleChange('concept')}
                className='conceptField'
                helperText={'Kirjoita kurssiin liittyvä uusi käsite tähän'}
                margin='normal'
              />
              <Button color='primary' onClick={() => this.addConcept()} variant="contained" className='saveButton'>
                Lisää käsite
              </Button>
            </form>
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
)(Concepts)