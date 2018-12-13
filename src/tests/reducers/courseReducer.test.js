import courseReducer from '../../app/reducers/courseReducer'
import courseConstants from '../../app/reducers/constants/courseConstants'
import groupConstants from '../../app/reducers/constants/groupConstants'

const INITIAL_STATE = {
  courses: [],
  coursesLoading: false,
  currentCourse: null,
  currentCourseLoading: false
}

const loadedCourses = {
  ...INITIAL_STATE,
  courses: [
    {
      _id: '123',
      groups: [ 'group1' ]
    },
    {
      _id: '456',
      groups: []
    }
  ]
}

describe('courseReducer', () => {
  it('should return initial state', () => {
    expect(courseReducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  it('FETCH_COURSES should set courses: [] and coursesLoading: true', () => {
    expect(courseReducer(loadedCourses, {
      type: courseConstants.FETCH_COURSES
    })).toEqual({
      ...loadedCourses,
      courses: [],
      coursesLoading: true
    })
  })
  it('FETCH_COURSES_SUCCESSFUL should set new courses and coursesLoading: false', () => {
    expect(courseReducer({
      ...INITIAL_STATE,
      coursesLoading: true
    }, {
      type: courseConstants.FETCH_COURSES_SUCCESSFUL,
      data: [ 'newCourse1', 'newCourse2' ]
    })).toEqual({
      ...INITIAL_STATE,
      courses: [ 'newCourse1', 'newCourse2' ]
    })
  })
  it('FETCH_COURSE should set currentCourseLoading: false', () => {
    expect(courseReducer({ ...INITIAL_STATE, currentCourseLoading: true }, {
      type: courseConstants.FETCH_COURSE
    })).toEqual({
      ...INITIAL_STATE,
      currentCourseLoading: false
    })
  })
  it('FETCH_COURSE_SUCCESSFUL should set new currentCourse', () => {
    expect(courseReducer(INITIAL_STATE, {
      type: courseConstants.FETCH_COURSE_SUCCESSFUL,
      data: 'newCourse1'
    })).toEqual({
      ...INITIAL_STATE,
      currentCourse: 'newCourse1'
    })
  })
  it('CREATE_COURSE_SUCCESSFUL should add the new course to courses', () => {
    expect(courseReducer(loadedCourses, {
      type: courseConstants.CREATE_COURSE_SUCCESSFUL,
      data: 'newCourse'
    })).toEqual({
      ...loadedCourses,
      courses: [ ...loadedCourses.courses, 'newCourse' ]
    })
  })
  it('CREATE_GROUP_SUCCESSFUL should add the new group to the correct course', () => {
    expect(courseReducer(loadedCourses, {
      type: groupConstants.CREATE_GROUP_SUCCESSFUL,
      data: {
        course: '456',
        otherData: 'otherData'
      }
    })).toEqual({
      ...loadedCourses,
      courses: [
        {
          _id: '123',
          groups: [ 'group1' ]
        },
        {
          _id: '456',
          groups: [
            {
              course: '456',
              otherData: 'otherData'
            }
          ]
        }
      ]
    })
  })
  it('UPDATE_COURSE_SUCCESSFUL updates the correct course and keeps the original groups', () => {
    expect(courseReducer(loadedCourses, {
      type: courseConstants.UPDATE_COURSE_SUCCESSFUL,
      data: {
        _id: '123',
        newData: 'newData',
        groups: [ 'willNotBeAdded' ]
      }
    })).toEqual({
      ...loadedCourses,
      courses: [
        {
          _id: '123',
          newData: 'newData',
          groups: [ 'group1' ]
        },
        {
          _id: '456',
          groups: []
        }
      ]
    })
  })
})
