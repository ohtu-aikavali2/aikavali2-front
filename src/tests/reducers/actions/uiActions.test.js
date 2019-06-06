// import * as actions from '../../../app/reducers/actions/uiActions'
// import configureMockStore from 'redux-mock-store'
// import thunk from 'redux-thunk'

// const middlewares = [thunk]
// const mockStore = configureMockStore(middlewares)

// describe('uiActions', () => {
//   let reduxStore = null
//   beforeEach(() => {
//     // mockStore is required for async functions
//     reduxStore = mockStore({ toggleDrawer: false })
//   })
//   it('toggleDrawer dipatches TOGGLE_DRAWER', () => {
//     return reduxStore.dispatch(actions.toggleDrawer()).then(() => {
//       // return of async actions
//       const storeActions = reduxStore.getActions()
//       let containsToggle = false
//       storeActions.forEach(action => {
//         if (action.type === 'Toggle Drawer') {
//           containsToggle = true
//         }
//       })
//       expect(containsToggle).toBe(true)
//     })
//   })
// })
