import * as actions from '../../../app/reducers/actions/courseActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('../../../app/services/courseService')
import courseService from '../../../app/services/courseService'
import courseConstants from '../../../app/reducers/constants/courseConstants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('courseActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({})
  })
  afterAll(() => {
    jest.unmock('../../../app/services/courseService')
  })

  it('fetchCourses dispatches FETCH_COURSES and FETCH_COURSES_SUCCESSFUL with correct data', () => {
    const returnValue = [ 'c1', 'c2' ]
    courseService.getCourses.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.fetchCourses()).then(() => {
      const storeActions = reduxStore.getActions()
      expect(storeActions[0].type).toEqual(courseConstants.FETCH_COURSES)

      expect(courseService.getCourses).toHaveBeenCalledTimes(1)

      expect(storeActions[1].type).toEqual(courseConstants.FETCH_COURSES_SUCCESSFUL)
      expect(storeActions[1].data).toEqual(returnValue)
      courseService.getCourses.mockClear()
    })
  })
  it('fetchCourse dispatches FETCH_COURSE and FETCH_COURSE_SUCCESSFUL with correct data', () => {
    const returnValue = 'course'
    courseService.getCourse.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.fetchCourse('name')).then(() => {
      const storeActions = reduxStore.getActions()
      expect(storeActions[0].type).toEqual(courseConstants.FETCH_COURSE)

      expect(courseService.getCourse).toHaveBeenCalledWith('name')

      expect(storeActions[1].type).toEqual(courseConstants.FETCH_COURSE_SUCCESSFUL)
      expect(storeActions[1].data).toEqual(returnValue)
      courseService.getCourse.mockClear()
    })
  })
  it('createCourse dispatches CREATE_COURSE_SUCCESSFUL with correct data', () => {
    const returnValue = 'newCourse'
    courseService.createCourse.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.createCourse('courseData')).then(() => {
      const storeActions = reduxStore.getActions()
      expect(courseService.createCourse).toHaveBeenCalledWith('courseData')
      expect(storeActions[0].type).toEqual(courseConstants.CREATE_COURSE_SUCCESSFUL)
      expect(storeActions[0].data).toEqual(returnValue)
    })
  })
  it('updateCourse dispatches UPDATE_COURSE_SUCCESSFUL with correct data', () => {
    const returnValue = 'updatedCourse'
    courseService.updateCourse.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.updateCourse('courseData', 'courseId')).then(() => {
      const storeActions = reduxStore.getActions()
      expect(courseService.updateCourse).toHaveBeenCalledWith('courseData', 'courseId')
      expect(storeActions[0].type).toEqual(courseConstants.UPDATE_COURSE_SUCCESSFUL)
      expect(storeActions[0].data).toEqual(returnValue)
    })
  })
})
