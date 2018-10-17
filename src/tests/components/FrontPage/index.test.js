import React from 'react'
import { shallow } from 'enzyme'
import { FrontPage } from '../../../app/components/FrontPage'
import Question from '../../../app/components/Question'

describe('FrontPage', () => {
  let wrapper, props
  beforeEach(() => {
    props = {
      loggedUserInitialization: jest.fn(),
      logout: jest.fn(),
      getRandomQuestion: jest.fn(),
      initializeGame: jest.fn(),
      loggedUser: {
        loggedUser: {
          id: 12345,
          token: 54321
        }
      }
    }
    wrapper = shallow(<FrontPage {...props} />)
  })
  describe('componentDidMount', () => {
    it('calls getRandomQuestion() (THIS TEST USES A 50 ms TIMEOUT, MIGHT FAIL BECAUSE OF THAT)', () => {
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      }, 50)
    })
    it('calls intializeGame()', () => {
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
    })
  })
  describe('componentWillReceiveProps', () => {
    it('calls getRandomQuestion if nextProps.loggedUser === null (THIS TEST USES A 50 ms TIMEOUT, MIGHT FAIL BECAUSE OF THAT)', () => {
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      }, 50)
      wrapper.setProps({ loggedUser: { loggedUser: null }, getRandomQuestion: props.getRandomQuestion })
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(2)
      }, 50)
      // 2 times, because the first one is called in componentDidMount()
    })
    it('calls initializeGame if nextProps.loggedUser === null', () => {
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
      wrapper.setProps({ loggedUser: { loggedUser: null }, initializeGame: props.initializeGame })
      // 2 times, because the first one is called in componentDidMount()
      expect(props.initializeGame).toHaveBeenCalledTimes(2)
    })
    it('does not call getRandomQuestion if nextProps.loggedUser is different than null, undefined or false (THIS TEST USES A 50 ms TIMEOUT, MIGHT FAIL BECAUSE OF THAT)', () => {
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      }, 50)
      wrapper.setProps({
        loggedUser: {
          loggedUser: {
            id: 2324, token: 4345
          }
        },
        getRandomQuestion: props.getRandomQuestion
      })
      setTimeout(() => {
        expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      }, 50)
    })
    it('does not call initializeGame if nextProps.loggedUser is different than null, undefined or false', () => {
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
      wrapper.setProps({
        loggedUser: {
          loggedUser: {
            id: 2324, token: 4345
          }
        },
        initializeGame: props.initializeGame
      })
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
    })
  })
  it('renders self', () => {
    expect(wrapper.find('.frontPageContainer').length).toBe(1)
  })
  it('renders question', () => {
    expect(wrapper.find(Question).length).toBe(1)
  })
})
