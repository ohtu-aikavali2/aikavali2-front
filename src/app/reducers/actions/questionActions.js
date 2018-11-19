import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'
import { shuffle } from '../../utilities/shuffleArray'

export const getRandomQuestion = (course = null) => {
  console.log('getRandomQuestion')
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCHING_QUESTION
    })
    let random = await questionService.getRandomQuestion(course)
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
    if (!data.error) {
      dispatch({
        type: questionConstants.QUESTION_ANSWERED,
        data
      })
    } else {
      // If there was an error, dispatch a message to redux
      dispatch({
        type: questionConstants.ADD_MESSAGE_FROM_BACKEND,
        data: data.error
      })
    }
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

export const deleteQuestions = (questionIDs) => {
  return async (dispatch) => {
    const response = await questionService.deleteQuestions(questionIDs)
    if (!response.error) {
      // If everything went well, change redux state aswell. (Delete from flaggedQuestions)
      dispatch({
        type: questionConstants.DELETE_QUESTIONS,
        data: questionIDs
      })
    }
  }
}

/* ---------- Flagged questions ----------- */

export const getAllFlaggedQuestions = () => {
  return async (dispatch) => {
    const data = await questionService.getAllFlaggedQuestions()
    dispatch({
      type: questionConstants.GET_FLAGGED_QUESTIONS,
      data
    })
  }
}
