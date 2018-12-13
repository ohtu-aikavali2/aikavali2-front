import mockAxios from 'axios'
jest.unmock('../../app/services/courseService')
import courseService from '../../app/services/courseService'

describe('courseService', () => {
  let headers
  afterEach(() => {
    mockAxios.get.mockClear()
    mockAxios.post.mockClear()
    mockAxios.put.mockClear()
    mockAxios.patch.mockClear()
  })
  it('setToken sets token', () => {
    courseService.setToken(12345)
    expect(courseService.getToken()).toEqual('bearer 12345')
    headers = { headers: { 'Authorization': 'bearer 12345' } }
  })
  it('getCourses calls axiot get with correct parameters and returns correct data', async () => {
    mockAxios.get.mockReturnValueOnce({ data: 'dataFromBe' })
    let response = await courseService.getCourses()
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/v1/courses',
      headers
    )
    expect(response).toEqual('dataFromBe')
  })
  it('getCourse calls axios get with correct params and returns correct data', async () => {
    mockAxios.get.mockReturnValueOnce({ data: 'dataFromBe' })
    let response = await courseService.getCourse('courseName')
    expect(mockAxios.get).toHaveBeenCalledWith(
      '/api/v1/courses/courseName',
      headers
    )
    expect(response).toEqual('dataFromBe')
  })
  it('createCourse calls axios post with correct params and returns correct data', async () => {
    mockAxios.post.mockReturnValueOnce({ data: 'dataFromBe' })
    let response = await courseService.createCourse('courseData')
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/v1/courses',
      'courseData',
      headers
    )
    expect(response).toEqual('dataFromBe')
  })
  it('updateCourse calls axios patch with correct params and returns correct data', async () => {
    mockAxios.patch.mockReturnValueOnce({ data: 'dataFromBe' })
    let response = await courseService.updateCourse('courseData', 'courseId')
    expect(mockAxios.patch).toHaveBeenCalledWith(
      '/api/v1/courses/courseId',
      'courseData',
      headers
    )
    expect(response).toEqual('dataFromBe')
  })
})
