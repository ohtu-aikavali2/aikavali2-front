import courseConstants from './constants/courseConstants'

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

    default: {
      return state
    }
  }
}

export default reducer
