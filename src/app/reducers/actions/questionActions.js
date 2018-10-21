import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'
import { shuffle } from '../../utilities/shuffleArray'

export const getRandomQuestion = () => {
  console.log('getRandomQuestion')
  return async (dispatch) => {
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
  console.log('vastausaika: ' + (time / 1000) + ' sekuntia')
  // Nyt tarvii enää backendiin toteuttaa tuo ajan vastaanottaminen
  return async (dispatch) => {
    const data = await questionService.answerQuestion(id, value)
    dispatch({
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
  }
}

export const postCompileQuestion = (correctAnswer, options) => {
  return async () => {
    await questionService.postCompileQuestion(correctAnswer, options)
  }
}

export const postPrintQuestion = (value, correctAnswer, options) => {
  return async () => {
    await questionService.postPrintQuestion(value, correctAnswer, options)
  }
}
