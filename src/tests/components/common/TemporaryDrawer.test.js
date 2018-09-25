import React from 'react'
import { mount } from 'enzyme'
import TemporaryDrawer from '../../../app/components/common/TemporaryDrawer'
import DrawerMaterial from '@material-ui/core/Drawer'

describe('<TemporaryDrawer />', () => {
  let temporaryDrawer
  const props = {
    toggleDrawer: jest.fn(),
    isOpen: false
  }
  beforeAll(() => {
    temporaryDrawer = mount(<TemporaryDrawer {...props} />)
  })
  it('renders self and subcomponents', () => {
    expect(temporaryDrawer.find('.temporaryDrawer').length).toBe(1)
    const drawerComponent = temporaryDrawer.find(DrawerMaterial)
    expect(drawerComponent.hasClass('drawer')).toBe(true)
    const containerComponent = temporaryDrawer.find('div')
    expect(containerComponent.length).toBe(1)
    // expect(containerComponent.length).toBe(1)
    console.log(containerComponent.props())
  })
})