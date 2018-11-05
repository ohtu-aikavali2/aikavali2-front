import React from 'react'
import { shallow } from 'enzyme'
import { Loading } from '../../../app/components/common/Loading'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'

describe('<Loading />', () => {
  let props, wrapper
  beforeAll(() => {
    props = {
      bar: false
    }
    wrapper = shallow(<Loading {...props} />)
  })
  it('renders self', () => {
    expect(wrapper.find('.loadingContainer').length).toBe(1)
  })
  it('renders Circular loading screen if bar === false', () => {
    expect(wrapper.find(CircularProgress).length).toBe(1)
    expect(wrapper.find(LinearProgress).length).toBe(0)
  })
  it('renders Linear loading screen if bar === true', () => {
    wrapper.setProps({ bar: true })
    expect(wrapper.find(CircularProgress).length).toBe(0)
    expect(wrapper.find(LinearProgress).length).toBe(1)
  })
})
