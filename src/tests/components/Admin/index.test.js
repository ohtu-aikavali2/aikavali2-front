import React from 'react'
import { shallow } from 'enzyme'
import { AdminPage } from '../../../app/components/Admin'
import QuestionFrom from '../../../app/components/Admin/QuestionForm'

describe('AdminPage', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      loggedUserInitialization: jest.fn(),
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
  describe('componentDidMount', () => {
    it('calls loggedUserInitialization', async () => {
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
    })
  })
  describe('componentWillReceiveProps', () => {
    it('calls loggedUserInitialization if nextProps.loggedUser === null', () => {
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
      wrapper.setProps({ loggedUser: { loggedUser: null }, loggedUserInitialization: props.loggedUserInitialization })
      // 2 times, because the first one is called in componentDidMount()
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(2)
    })
    it('does not call loggedUserInitialization if nextProps.loggedUser is different than null, undefined or false', () => {
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
      wrapper.setProps({
        loggedUser: {
          loggedUser: {
            id: 2324, token: 4345
          }
        },
        loggedUserInitialization: props.loggedUserInitialization
      })
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
    })
  })
  it('renders self', () => {
    expect(wrapper.find('.adminPageContainer').length).toBe(1)
  })
  it('renders QuestionForm', () => {
    expect(wrapper.find(QuestionFrom).length).toBe(1)
  })
})
