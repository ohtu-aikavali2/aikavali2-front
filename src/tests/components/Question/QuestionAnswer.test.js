import React from 'react'
import { shallow } from 'enzyme'
import { QuestionAnswer } from '../../../app/components/Question/QuestionAnswer'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

describe('<QuestionAnswer />', () => {
  let question
  const props = {
    selectAnswer: jest.fn(),
    userAnswer: null,
    selectedAnswer: null,
    value: 'Option',
    id: 1,
    classes: {
      wrapper: {},
      paper: {}
    }
  }
  beforeAll(() => {
    // Component requires propTypes classes
    question = shallow(<QuestionAnswer {...props} />)
  })
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
      children: 'Option'
    })
  })
  it('container <div> click calls the method handleClick() which calls the prop selectAnswer() is userAnswer is null', () => {
    const spy = jest.spyOn(question.instance(), 'handleClick')

    // forceUpdate for instance() is NEEDED!!
    question.instance().forceUpdate()
    let containerDiv = question.find('div').first()
    containerDiv.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(props.selectAnswer).toHaveBeenCalledTimes(1)
  })
})
/*
const mapStateToProps = (state) => {
  return {
    selectedAnswer: state.question.selectedAnswer,
    userAnswer: state.question.userAnswer
  }
}

const mapDispatchToProps = {
  answerQuestion,
  selectAnswer
}
*/