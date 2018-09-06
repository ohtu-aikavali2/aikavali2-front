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
