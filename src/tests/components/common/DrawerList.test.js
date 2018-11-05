import React from 'react'
import { shallow } from 'enzyme'
import { DrawerList } from '../../../app/components/common/DrawerList'

describe('<DrawerList />', () => {
  let wrapper
  beforeAll(() => {
    wrapper = shallow(<DrawerList />)
  })
  it('renders self', () => {
    expect(wrapper.find('.drawerList').length).toBe(1)
  })
})
