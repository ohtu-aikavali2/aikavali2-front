import uiConstants from '../constants/uiConstants'

export const toggleDrawer = () => {
  return async (dispatch) => {
    dispatch({
      type: uiConstants.TOGGLE_DRAWER
    })
  }
}
