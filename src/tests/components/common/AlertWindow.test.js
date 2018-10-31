import React from 'react'
import { shallow } from 'enzyme'
import { AlertWindow } from '../../../app/components/common/AlertWindow'
import Typography from '@material-ui/core/Typography'

describe('AlertWindow', () => {
  let alertWindow, props
  beforeAll(() => {
    props = {
      title: 'Title',
      children: (
        <div className='childComponent' />
      )
    }
    alertWindow = shallow(<AlertWindow {...props} />)
  })
  it('renders self', () => {
    expect(alertWindow.find('.alertWindowContainer').length).toBe(1)
  })
  it('renders the given title', () => {
    const typo = alertWindow.find(Typography)
    expect(typo.props().children).toEqual(props.title)
  })
  it('renders given children', () => {
    const div = alertWindow.find('.alertWindowContainer')
    expect(div.children().find('.childComponent').length).toBe(1)
  })
})
