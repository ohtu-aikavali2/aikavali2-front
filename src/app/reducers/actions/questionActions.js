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
    dispatch({
      type: questionConstants.QUESTION_ANSWERED,
      data
    })
  }
}

export const postCompileQuestion = (groupId, correctAnswer, options) => {
  return async () => {
    await questionService.postQuestion({ type: 'compile', correctAnswer, options, groupId })
  }
}

export const postPrintQuestion = (groupId, value, correctAnswer, options) => {
  return async () => {
    await questionService.postQuestion({ type: 'print', value, correctAnswer, options, groupId })
  }
}

export const sendReviewForQuestion = (id, review) => {
  return async () => {
    await questionService.sendReviewForQuestion(id, review)
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

export const getFlaggedQuestionsByCourse = (course) => {
  console.log('course name: ' + course)
  return async (dispatch) => {
    const data = await questionService.getFlaggedQuestionsByCourse(course)
    dispatch({
      type: questionConstants.GET_FLAGGED_QUESTIONS,
      data
    })
  }
}
