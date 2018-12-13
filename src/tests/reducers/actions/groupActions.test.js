import * as actions from '../../../app/reducers/actions/groupActions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('../../../app/services/groupService')
import groupService from '../../../app/services/groupService'
import groupConstants from '../../../app/reducers/constants/groupConstants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('groupActions', () => {
  let reduxStore = null
  beforeEach(() => {
    // mockStore is required for async functions
    reduxStore = mockStore({})
  })
  afterAll(() => {
    jest.unmock('../../../app/services/groupService')
  })

  it('createGroup dispatches CREATE_GROUP_SUCCESSFUL with correct data', () => {
    const returnValue = 'newGroup'
    groupService.createGroup.mockReturnValueOnce(returnValue)
    return reduxStore.dispatch(actions.createGroup('groupData')).then(() => {
      const storeActions = reduxStore.getActions()
      expect(groupService.createGroup).toHaveBeenCalledWith('groupData')
      expect(storeActions[0].type).toEqual(groupConstants.CREATE_GROUP_SUCCESSFUL)
      expect(storeActions[0].data).toEqual(returnValue)
    })
  })
})
