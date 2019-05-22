import questionConstants from '../constants/questionConstants'
import questionService from '../../services/questionService'
import { shuffle } from '../../utilities/shuffleArray'

export const fetchQuestions = () => {
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCH_QUESTIONS
    })
    const questions = await questionService.getQuestions()
    dispatch({
      type: questionConstants.FETCH_QUESTIONS_SUCCESFUL,
      data: questions
    })
  }
}

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

export const postCompileQuestion = (groupId, correctAnswer, options, concept) => {
  return async () => {
    await questionService.postQuestion({ type: 'compile', correctAnswer, options, groupId, concept })
  }
}

export const postPrintQuestion = (groupId, value, correctAnswer, options, concept) => {
  return async () => {
    await questionService.postQuestion({ type: 'print', value, correctAnswer, options, groupId, concept })
  }
}

export const postGeneralQuestion = (groupId, value, correctAnswer, options, concept) => {
  return async () => {
    //console.log('konsepti actions-kohdassa: ', concept)
    await questionService.postQuestion({ type: 'general', value, correctAnswer, options, groupId, concept })
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
    if (!response) {
      // If everything went well, change redux state aswell. (Delete from flaggedQuestions)
      dispatch({
        type: questionConstants.DELETE_QUESTIONS,
        data: questionIDs
      })
    }
  }
}

export const unflagQuestions = (questionIDs) => {
  return async (dispatch) => {
    const response = await questionService.unflagQuestions(questionIDs)
    if (!response) {
      dispatch({
        type: questionConstants.UNFLAG_QUESTIONS,
        data: questionIDs
      })
    }
  }
}

export const flagQuestion = (questionID) => {
  return async () => {
    await questionService.flagQuestion(questionID)
  }
}

export const getDeletedQuestions = () => {
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCHING_QUESTION
    })
    const data = await questionService.getDeletedQuestions()
    dispatch({
      type: questionConstants.GET_DELETED_QUESTIONS,
      data
    })
  }
}

export const restoreQuestions = (questionIDs) => {
  return async (dispatch) => {
    const response = await questionService.restoreQuestions(questionIDs)
    if (!response) {
      dispatch({
        type: questionConstants.RESTORE_QUESTIONS,
        data: questionIDs
      })
    }
  }
}

export const getAvailableQuestions = () => {
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCHING_QUESTION
    })
    const data = await questionService.getAvailableQuestions()
    dispatch({
      type: questionConstants.GET_AVAILABLE_QUESTIONS,
      data
    })
  }
}

/* ---------- Flagged questions ----------- */

export const getAllFlaggedQuestions = () => {
  return async (dispatch) => {
    dispatch({
      type: questionConstants.FETCHING_QUESTION
    })
    const data = await questionService.getAllFlaggedQuestions()
    dispatch({
      type: questionConstants.GET_FLAGGED_QUESTIONS,
      data
    })
  }
}
