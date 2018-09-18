import exampleConstants from '../constants/exampleConstants'
import exampleService from '../../services/exampleService'

export const exampleIncrement = (value) => {
  return async (dispatch) => {
    await exampleService.mockRequest()
    dispatch({
      type: exampleConstants.EXAMPLE_INCREMENT,
      payload: value
    })
  }
}
export const getExample = () => {
  return async (dispatch) => {
    const example = await exampleService.getExample()
    dispatch({
      type: exampleConstants.GET_EXAMPLE,
      data: example.message
    })
  }
}
