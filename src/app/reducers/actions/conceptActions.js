import conceptConstants from '../constants/conceptConstants'
import conceptService from '../../services/conceptService'

export const fetchConcepts = () => {
  return async (dispatch) => {
    dispatch({
      type: conceptConstants.FETCH_CONCEPTS
    })
    const concepts = await conceptService.getConcepts()
    dispatch({
      type: conceptConstants.FETCH_CONCEPTS_SUCCESFUL,
      data: concepts
    })
  }
}

export const postConcepts = () => {
  return async () => {
    await conceptService.postConcept({ name })
  }
}

export const deleteConcepts = (conceptIDs) => {
  return async (dispatch) => {
    const response = await conceptService.deleteQuestions(conceptIDs)
    if (!response) {
      dispatch({
        type: conceptConstants.DELETE_CONCEPTS,
        data: conceptIDs
      })
    }
  }
}

export const getDeletedConcepts = () => {
  return async (dispatch) => {
    dispatch({
      type: conceptConstants.FETCHING_CONCEPTS
    })
    const data = await conceptService.getDeletedConcepts()
    dispatch({
      type: conceptConstants.GET_DELETED_CONCEPTS,
      data
    })
  }
}

export const restoreConcepts = (conceptIDs) => {
  return async (dispatch) => {
    const response = await conceptService.restoreConcepts(conceptIDs)
    if (!response) {
      dispatch({
        type: conceptConstants.RESTORE_CONCEPTS,
        data: conceptIDs
      })
    }
  }
}

export const getAvailableConcepts = () => {
  return async (dispatch) => {
    dispatch({
      type: conceptConstants.FETCHING_CONCEPTS
    })
    const data = await conceptService.getAvailableConcepts()
    dispatch({
      type: conceptConstants.GET_AVAILABLE_QUESTIONS,
      data
    })
  }
}