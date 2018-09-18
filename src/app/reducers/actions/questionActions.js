import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'

export const getRandomQuestion = () => {
  return async (dispatch) => {
    const random = await questionService.getRandomQuestion()
    dispatch({
      type: questionConstants.GET_RANDOM_QUESTION,
      data: random
    })
  }
}
