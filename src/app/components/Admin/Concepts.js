import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchCourses} from '../../reducers/actions/courseActions'
import ClickBox from '../common/ClickBox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import './admin.css'

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
      <div className='conceptFormContainer'>
        {step === 0 && (
          <React.Fragment>
            <h2>Valitse kurssi</h2>
            {courses.map(course => <ClickBox key={course._id} title={course.name} onClick={this.handleClick(course)}/>)}
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
                          <ListItemIcon>
                            <DeleteIcon />
                          </ListItemIcon>
                        </ListItem>
                      )
                  )}
                </List>
              </div>
            </Grid>
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