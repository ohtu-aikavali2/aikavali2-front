import mockAxios from 'axios'
jest.unmock('../../app/services/groupService')
import groupService from '../../app/services/groupService'

describe('groupService', () => {
  let headers = { headers: { 'Authorization': null } }
  afterEach(() => {
    mockAxios.get.mockClear()
    mockAxios.post.mockClear()
    mockAxios.put.mockClear()
    mockAxios.patch.mockClear()
  })
  // There should be a setToken in groupService (TODO: ADD)
  /*it('setToken sets token', () => {
    groupService.setToken(12345)
    expect(groupService.getToken()).toEqual('bearer 12345')
    headers = { headers: { 'Authorization': 'bearer 12345' } }
  })*/
  it('createGroup calls axios post with correct params and returns correct data', async () => {
    mockAxios.post.mockReturnValueOnce({ data: 'dataFromBe' })
    let response = await groupService.createGroup('groupData')
    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/v1/groups',
      'groupData',
      headers
    )
    expect(response).toEqual('dataFromBe')
  })
})