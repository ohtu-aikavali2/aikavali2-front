import courseConstants from '../constants/courseConstants'
import courseService from '../../services/courseService'

export const fetchCourses = () => {
  return async (dispatch) => {
    dispatch({
      type: courseConstants.FETCH_COURSES
    })
    const courses = await courseService.getCourses()
    dispatch({
      type: courseConstants.FETCH_COURSES_SUCCESSFUL,
      data: courses
    })
  }
}

export const fetchCourse = (name) => {
  return async (dispatch) => {
    dispatch({
      type: courseConstants.FETCH_COURSE
    })
    const course = await courseService.getCourse(name)
    dispatch({
      type: courseConstants.FETCH_COURSE_SUCCESSFUL,
      data: course
    })
  }
}
