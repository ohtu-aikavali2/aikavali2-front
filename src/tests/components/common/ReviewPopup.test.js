import React from 'react'
import { shallow } from 'enzyme'
import { ReviewPopup } from '../../../app/components/common/ReviewPopup'
import AlertWindow from '../../../app/components/common/AlertWindow'
import LikertScale from 'likert-react'

describe ('<ReviewPopup />', () => {
  let popup, props
  beforeAll(() => {
    props = {
      toggle: jest.fn(),
      submit: jest.fn()
    }
    popup = shallow(<ReviewPopup {...props} />)
  })
  it('renders self', () => {
    expect(popup.find('.popupContainer').length).toBe(1)
  })
  it('renders fullScreen background', () => {
    const background = popup.find('.background')
    expect(background.length).toBe(1)
    expect(background.props().style.width).toEqual('100%')
    expect(background.props().style.height).toEqual('100%')
  })
  it('renders AlertWindow with LikertScale component inside it', () => {
    const alertWindow = popup.find(AlertWindow)
    expect(alertWindow.length).toBe(1)
    expect(alertWindow.children().find(LikertScale).length).toBe(1)
  })
  it('background press calls props.toggle', () => {
    const background = popup.find('.background')
    expect(props.toggle).toHaveBeenCalledTimes(0)
    background.simulate('click')
    expect(props.toggle).toHaveBeenCalledTimes(1)
    props.toggle.mockClear()
  })
  it('LikertScale click calls props.submit', () => {
    const scale = popup.find(LikertScale)
    expect(props.submit).toHaveBeenCalledTimes(0)
    scale.simulate('click')
    expect(props.submit).toHaveBeenCalledTimes(1)
    props.submit.mockClear()
  })
})
