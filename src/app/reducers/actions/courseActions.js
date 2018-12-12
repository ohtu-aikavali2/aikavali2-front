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

export const createCourse = (data) => {
  return async (dispatch) => {
    const newCourse = await courseService.createCourse(data)
    dispatch({
      type: courseConstants.CREATE_COURSE_SUCCESSFUL,
      data: newCourse
    })
  }
}

export const updateCourse = (data, id) => {
  return async (dispatch) => {
    const updatedCourse = await courseService.updateCourse(data, id)
    dispatch({
      type: courseConstants.UPDATE_COURSE_SUCCESSFUL,
      data: updatedCourse
    })
  }
}
