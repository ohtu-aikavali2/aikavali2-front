import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'
import { shuffle } from '../../utilities/shuffleArray'

export const getRandomQuestion = () => {
  return async (dispatch) => {
    let random = await questionService.getRandomQuestion()
    // shuffle the options and hold all the fields
    random = {
      ...random,
      item: {
        ...random.item,
        options: shuffle(random.item.options)
      }
    }
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
