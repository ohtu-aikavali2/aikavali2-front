import React from 'react'
import { shallow } from 'enzyme'
import { QuestionAnswer } from '../../../app/components/Question/QuestionAnswer'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

describe('<QuestionAnswer />', () => {
  let question, props
  beforeEach(() => {
    // Component requires propTypes classes
    props = {
      handleSelect: jest.fn(),
      handleConfirm: jest.fn(),
      userAnswer: null,
      selected: false,
      value: 'Option',
      id: 1,
      classes: {
        wrapper: {},
        paper: {}
      }
    }
    question = shallow(<QuestionAnswer {...props} />)
  })
  /*afterEach(() => {
    props.handleSelect.mockClear()
    props.handleConfirm.mockClear()
  })*/
  it('renders self and subcomponents', () => {
    const containerDiv = question.find('div').first()
    expect(containerDiv.props().id).toEqual('container')
    expect(question.find(Paper).props().id).toEqual('paper')
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
      children: itemGrid.props().children
    })
    const typography = question.find(Typography)
    expect(typography.props()).toEqual({
      className: 'typography',
      align: 'center',
      children: 'Option',
      style: {}
    })
  })
  it('container <div> click calls the method handleClick() which calls the prop handleSelect() if userAnswer is null AND selected === false (user has not yet selected any option)', () => {
    const spy = jest.spyOn(question.instance(), 'handleClick')

    // forceUpdate for instance() is NEEDED!!
    question.instance().forceUpdate()
    let containerDiv = question.find('div').first()
    containerDiv.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(props.handleSelect).toHaveBeenCalledTimes(1)
    expect(props.handleConfirm).toHaveBeenCalledTimes(0)
  })
  it('container <div> click calls the method handleClick() which calls the prop handleConfirm() if userAnswer is null and selected === true (user has already selected that specific option)', () => {
    props = {
      ...props,
      selected: true
    }
    question = shallow(<QuestionAnswer {...props} />)
    const spy = jest.spyOn(question.instance(), 'handleClick')

    // forceUpdate for instance() is NEEDED!!
    question.instance().forceUpdate()
    let containerDiv = question.find('div').first()
    containerDiv.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(props.handleSelect).toHaveBeenCalledTimes(0)
    expect(props.handleConfirm).toHaveBeenCalledTimes(1)
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
          isCorrect: true
        },
        selected: true
      }
      question = shallow(<QuestionAnswer {...props} />)
      const paperStyle = question.find(Paper).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(113, 218, 113)' })
    })
    it('is set to correctStyle when question has been answered wrong (shows the correct answer)', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: false,
          correctAnswer: 'Option'
        }
      }
      question = shallow(<QuestionAnswer {...props} />)
      const paperStyle = question.find(Paper).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(113, 218, 113)' })
    })
    it('is set to wrongStyle when option is selected and the answer is wrong', () => {
      props = {
        ...props,
        userAnswer: {
          isCorrect: false,
          correctAnswer: 'Something else'
        },
        selected: true
      }
      question = shallow(<QuestionAnswer {...props} />)
      const paperStyle = question.find(Paper).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(255, 128, 128)', cursor: 'default' })
    })
    it('is set to selectedStyle when option is selected but not yet answered', () => {
      props = {
        ...props,
        selected: true
      }
      question = shallow(<QuestionAnswer {...props} />)
      const paperStyle = question.find(Paper).props().style
      expect(paperStyle).toEqual({ backgroundColor: 'rgb(230, 243, 255)' })
    })
    it('if user has not selected any option, style is null', () => {
      const paperStyle = question.find(Paper).props().style
      expect(paperStyle).toEqual(null)
    })
  })
})
