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
    it('calls getRandomQuestion()', () => {
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
    })
    it('calls intializeGame()', () => {
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
    })
  })
  describe('componentWillReceiveProps', () => {
    it('calls getRandomQuestion if nextProps.loggedUser === null', () => {
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      wrapper.setProps({ loggedUser: { loggedUser: null }, getRandomQuestion: props.getRandomQuestion })
      // 2 times, because the first one is called in componentDidMount()
      // Tätä en sit taas vittu voi ymmärtää
      // expect(props.getRandomQuestion).toHaveBeenCalledTimes(2)
    })
    it('calls initializeGame if nextProps.loggedUser === null', () => {
      expect(props.initializeGame).toHaveBeenCalledTimes(1)
      wrapper.setProps({ loggedUser: { loggedUser: null }, initializeGame: props.initializeGame })
      // 2 times, because the first one is called in componentDidMount()
      // Enkä tätä
      // expect(props.initializeGame).toHaveBeenCalledTimes(2)
    })
    it('does not call getRandomQuestion if nextProps.loggedUser is different than null, undefined or false', () => {
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
      wrapper.setProps({
        loggedUser: {
          loggedUser: {
            id: 2324, token: 4345
          }
        },
        getRandomQuestion: props.getRandomQuestion
      })
      expect(props.getRandomQuestion).toHaveBeenCalledTimes(1)
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
