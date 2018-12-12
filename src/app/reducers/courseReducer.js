import courseConstants from './constants/courseConstants'
import groupConstants from './constants/groupConstants'

const initialState = {
  courses: [],
  coursesLoading: false,
  currentCourse: null,
  currentCourseLoading: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case courseConstants.FETCH_COURSES: {
      return {
        ...state,
        courses: [],
        coursesLoading: true
      }
    }

    case courseConstants.FETCH_COURSES_SUCCESSFUL: {
      return {
        ...state,
        coursesLoading: false,
        courses: action.data
      }
    }

    case courseConstants.FETCH_COURSE: {
      return {
        ...state,
        currentCourseLoading: false
      }
    }

    case courseConstants.FETCH_COURSE_SUCCESSFUL: {
      return {
        ...state,
        currentCourse: action.data
      }
    }

    case courseConstants.CREATE_COURSE_SUCCESSFUL: {
      return {
        ...state,
        courses: state.courses.concat(action.data)
      }
    }

    case groupConstants.CREATE_GROUP_SUCCESSFUL: {
      return {
        ...state,
        courses: state.courses.map((c) => c._id !== action.data.course ? c : { ...c, groups: c.groups.concat(action.data) })
      }
    }

    case courseConstants.UPDATE_COURSE_SUCCESSFUL: {
      return {
        ...state,
        courses: state.courses.map((c) => c._id !== action.data._id ? c : { ...action.data, groups: c.groups })
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
