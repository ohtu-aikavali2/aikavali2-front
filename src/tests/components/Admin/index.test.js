import React from 'react'
import { shallow } from 'enzyme'
import { AdminPage } from '../../../app/components/Admin'
import QuestionFrom from '../../../app/components/Admin/QuestionForm'

describe('AdminPage', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      logout: jest.fn(),
      loggedUser: {
        loggedUser: {
          id: 12345,
          token: 54321
        }
      }
    }
    wrapper = shallow(<AdminPage {...props} />)
  })
  it('renders self', () => {
    expect(wrapper.find('.adminPageContainer').length).toBe(1)
  })
  it('renders QuestionForm', () => {
    expect(wrapper.find(QuestionFrom).length).toBe(1)
  })
})
