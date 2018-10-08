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

export const answerQuestion = (id, value) => {
  return async (dispatch) => {
    const data = await questionService.answerQuestion(id, value)
    dispatch({
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
  }
}

export const selectAnswer = (id, value) => {
  const data = { id, value }
  return async (dispatch) => {
    dispatch({
      type: questionConstants.SELECT_ANSWER,
      data
    })
  }
}
