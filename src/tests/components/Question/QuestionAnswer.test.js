import React from 'react'
import { shallow } from 'enzyme'
import { GeneralQuestionAnswer } from '../../../app/components/Question/GeneralQuestionAnswer'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'

describe('<GeneralQuestionAnswer />', () => {
  let question, props
  beforeEach(() => {
    // Component requires propTypes classes
    props = {
      handleSelect: jest.fn(),
      handleSkip: jest.fn(),
      userAnswer: null,
      selectedList: [],
      value: 'Option',
      id: 1,
      classes: {
        wrapper: {},
        paper: {}
      }
    }
    question = shallow(<GeneralQuestionAnswer {...props} />)
  })
  afterEach(() => {
    props.handleSelect.mockClear()
    props.handleSkip.mockClear()
  })
  it('renders self and subcomponents', () => {
    const containerDiv = question.find('div').first()
    expect(containerDiv.props().id).toEqual('container')
    const containerGrid = question.find(Grid).first()
    expect(containerGrid.props()).toEqual({
      container: true,
      wrap: 'nowrap',
      spacing: 16,
      className: 'containerGrid',
      children: containerGrid.props().children
    })
    const itemGrid = question.find(Grid).at(1)
    expect(itemGrid.props()).toEqual({
      item: true,
      className: 'itemGrid',
      style: {},
      children: itemGrid.props().children
    })
    const markDown = question.find(ReactMarkdown)
    expect(markDown.props().source).toEqual('```\nOption')
  })
  it('Options are rendered correct', () => {
    props = {
      ...props,
      value: 'Eka rivi\nToka rivi\nKolmas rivi'
    }
    question = shallow(<GeneralQuestionAnswer {...props} />)
    expect(question.find(ReactMarkdown).props().source).toEqual('```\nEka rivi\nToka rivi\nKolmas rivi')
  })
  it('container <div> click calls the method handleClick()', () => {
    const spy = jest.spyOn(question.instance(), 'handleClick')
    // forceUpdate for instance() is NEEDED!!
    question.instance().forceUpdate()
    let containerDiv = question.find('div').first()
    containerDiv.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
  })
  describe('handleClick()', () => {
    it('calls the prop handleSelect() if userAnswer is null AND selected === false (user has not yet selected any option)', () => {
      question.instance().handleClick()
      expect(props.handleSelect).toHaveBeenCalledTimes(1)
    })
  })
  it('calls determineStyle() when rendered', () => {
    const spy = jest.spyOn(question.instance(), 'determineStyle')
    question.instance().forceUpdate()
    expect(spy).toHaveBeenCalledTimes(1)
  })
  describe('Paper style (determineStyle())', () => {
    it('is correctStyle when question is answered correct and option is selected', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: true,
          correctAnswer: ['Option']
        },
        selectedList: [
          {
            id: '1234',
            value: 'Option'
          }
        ]
      }
      question = shallow(<GeneralQuestionAnswer {...props} />)
      const paperStyle = question.find(Card).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(113, 218, 113)' })
    })
    it('is set to correctStyle when question has been answered wrong (shows the correct answer)', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: false,
          correctAnswer: ['Option']
        }
      }
      question = shallow(<GeneralQuestionAnswer {...props} />)
      const paperStyle = question.find(Card).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(113, 218, 113)' })
    })
    it('is set to wrongStyle when option is selected and the answer is wrong', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: false,
          correctAnswer: 'Something else'
        },
        selectedList: [
          {
            id: '1234',
            value: 'Option'
          }
        ]
      }
      question = shallow(<GeneralQuestionAnswer {...props} />)
      const paperStyle = question.find(Card).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(255, 128, 128)', cursor: 'default' })
    })
    it('is set to selectedStyle when option is selected but not yet answered', () => {
      props = {
        ...props,
        userAnswer: null,
        selectedList: [
          {
            id: '1234',
            value: 'Option'
          }
        ]
      }
      question = shallow(<GeneralQuestionAnswer {...props} />)
      const paperStyle = question.find(Card).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(230, 243, 255)', cursor: 'default' })
    })
    it('sets text color to grey when option is not selected', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: false,
          correctAnswer: 'something else'
        }
      }
      question = shallow(<GeneralQuestionAnswer {...props} />)
      const gridStyle = question.find(Grid).at(1).props().style
      expect(gridStyle).toEqual({ color: 'grey' })
    })
    it('if user has not selected any option, style is empty', () => {
      const paperStyle = question.find(Card).props().style
      expect(paperStyle).toEqual({ backgroundColor: '' })
    })
  })
})
