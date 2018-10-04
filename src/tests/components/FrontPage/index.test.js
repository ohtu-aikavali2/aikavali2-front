import React from 'react'
import { shallow } from 'enzyme'
import { FrontPage } from '../../../app/components/FrontPage'
import ButtonBar from '../../../app/components/common/ButtonBar'
import Question from '../../../app/components/Question'

describe('FrontPage', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      loggedUserInitialization: jest.fn(),
      logout: jest.fn(),
      getRandomQuestion: jest.fn(),
      loggedUser: {
        loggedUser: {
          id: 12345,
          token: 54321
        }
      },
      question: null
    }
    wrapper = shallow(<FrontPage {...props} />)
  })
  describe('componentDidMount', () => {
    it('calls loggedUserInitialization', async () => {
      expect(props.loggedUserInitialization).toHaveBeenCalledTimes(1)
    })
    it('calls getRandomQuestion', () => {
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
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
    expect(wrapper.find('.frontPageContainer').length).toBe(1)
  })
  it('renders ButtonBar', () => {
    expect(wrapper.find(ButtonBar).length).toBe(1)
  })
  it('renders question if it is not null, undefined or false', () => {
    expect(wrapper.find(Question).length).toBe(0)
    wrapper.setProps({ ...props, question: 'not NULL' })
    expect(wrapper.find(Question).length).toBe(1)
  })
})