import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'
import { shuffle } from '../../utilities/shuffleArray'

export const getRandomQuestion = () => {
  console.log('getRandomQuestion')
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCHING_QUESTION
    })
    let random = await questionService.getRandomQuestion()
    if (random.item) {
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
    } else if (random.message) {
      dispatch({
        type: questionConstants.ADD_MESSAGE_FROM_BACKEND,
        data: random.message
      })
    }
  }
}

export const answerQuestion = (id, value, time) => {
  return async (dispatch) => {
    dispatch({
      type: questionConstants.ANSWER_QUESTION
    })
    const data = await questionService.answerQuestion(id, value, time)
    dispatch({
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
  }
}

export const postCompileQuestion = (correctAnswer, options) => {
  return async () => {
    await questionService.postQuestion({ type: 'compile', correctAnswer, options })
  }
}

export const postPrintQuestion = (value, correctAnswer, options) => {
  return async () => {
    await questionService.postQuestion({ type: 'print', value, correctAnswer, options })
  }
}

export const sendReviewForQuestion = (id, review) => {
  return async () => {
    await questionService.sendReviewForQuestion(id, review)
  }
}
