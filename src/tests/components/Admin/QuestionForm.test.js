
import React from 'react'
import { shallow } from 'enzyme'
import { QuestionForm } from '../../../app/components/Admin/QuestionForm'
import Select from '@material-ui/core/Select'

describe('<QuestionForm />', () => {
  /*  const initialState = {
      questionType: '',
      question: '',
      correctAnswer: '',
      incorrectAnswers: ['', '', ''],
      course: '',
      groupId: '',
      courses:[]
  } */
  const questionTypes = [
    {
      value: 'GeneralQuestion',
      label: 'Yleinen kysymys'
    }
  ]
  let c = {
    groups: ['groupid123'],
    concepts: ['for', 'while'],
    _id: 123,
    name: 'Programming',
    imageSrc: 'noUrl',
    description: 'learn programming'
  }
  let props, wrapper
  beforeAll(() => {
    props = {
      postGeneralQuestion: jest.fn(),
      fetchCourses: jest.fn(),
      fetchQuestions: jest.fn(),
      course: c,
      history: {
        push: jest.fn()
      },
      courses: [],
      questions: [],
      questionTypes: questionTypes
    }
    wrapper = shallow(<QuestionForm {...props} />)
  })
  it('renders self', () => {
    expect(wrapper.find('.questionFormContainer').length).toBe(1)
    expect(wrapper.find('.questionFormBody').length).toBe(1)
  })
  it('renders select question type field', () => {
    expect(wrapper.find(Select).length).toBe(1)
  })
  it('at start, question field is not rendered', () => {
    expect(wrapper.find('.questionField').length).toBe(0)
  })

  it('user can select course and group and question field is not yet rendered', () => {
    const select = wrapper.find(Select)
    expect(wrapper.find('.questionField').length).toBe(0)
    select.simulate('change', { target: { value: c.name } })
    expect(wrapper.state().course).toEqual('Programming')
    const selectSecond = wrapper.find(Select).at(1)
    selectSecond.simulate('change', { target: { value: c.groups[0] } })
    expect(wrapper.state().groupId).toEqual('groupid123')
  })

  it('user can select \'Yleinen kysymys\' and state will be updated', () => {
    wrapper.setState({ step: 1 })
    const field = wrapper.find('.clickbox-link')
    expect(field.length).toBe(1)
    field.simulate('click')
    expect(wrapper.state().questionType).toEqual(questionTypes[0].value)
  })
  it('user input to question field calls method handleChange and stores value to state', () => {
    wrapper.setState({ step: 2 })
    const spy = jest.spyOn(wrapper.instance(), 'handleChange')
    let field = wrapper.find('.questionField')
    field.simulate('change', { target: { value: 'question?' } })
    expect(wrapper.state().question).toEqual('question?')
    expect(spy).toHaveBeenCalled()
    field = wrapper.find('.questionField')
    expect(field.props().value).toEqual('question?')
  })
  /*
  it('correct answer field is always rendered', () => {
    expect(wrapper.find('.rightAnswerField').length).toBe(1)
  })
  it('three wrong answer fields are rendered at start', () => {
    expect(wrapper.find('.wrongAnswerField').length).toBe(3)
  })
  it('add new wrong answer button is rendered', () => {
    expect(wrapper.find('.addButton').length).toBe(1)
  })
  it('delete wrong answer button is rendered', () => {
    expect(wrapper.find('.deleteButton').length).toBe(1)
  })
  it('save button is rendered', () => {
    expect(wrapper.find('.saveButton').length).toBe(1)
  })
  it('user input to question field calls method handleChange and stores value to state', () => {
    wrapper.setState({ questionType: 'tulostaa' })
    const spy = jest.spyOn(wrapper.instance(), 'handleChange')
    let field = wrapper.find('.questionField')
    field.simulate('change', { target: { value: 'kyssäri' } })
    expect(wrapper.state().question).toEqual('kyssäri')
    expect(spy).toHaveBeenCalled()
    field = wrapper.find('.questionField')
    expect(field.props().value).toEqual('kyssäri')
  })
  it('user input to right answer field calls method handleChange and stores value to state', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange')
    let field = wrapper.find('.rightAnswerField')
    field.simulate('change', { target: { value: 'oikea vastaus' } })
    expect(wrapper.state().correctAnswer).toEqual('oikea vastaus')
    expect(spy).toHaveBeenCalled()
    field = wrapper.find('.rightAnswerField')
    expect(field.props().value).toEqual('oikea vastaus')
  })
  it('user input to a specific wrong answer field calls method handleArrayChange and sets correct value', () => {
    // Olkoon nyt vaikka toinen väärä vastaus kenttä
    wrapper.setState({ incorrectAnswers: ['eka väärä', '', 'kolmas väärä'] })
    const spy = jest.spyOn(wrapper.instance(), 'handleArrayChange')
    let field = wrapper.find('.wrongAnswerField').at(1)
    field.simulate('change', { target: { value: 'toinen väärä vastaus' } })
    expect(spy).toHaveBeenCalled()
    field = wrapper.find('.wrongAnswerField').at(1)
    expect(field.props().value).toEqual('toinen väärä vastaus')
    // Tarkistetaan vielä, ettei muut kentät ole muuttuneet
    expect(wrapper.find('.wrongAnswerField').at(0).props().value).toEqual('eka väärä')
    expect(wrapper.find('.wrongAnswerField').at(2).props().value).toEqual('kolmas väärä')
  })
  it('add new wrong answer button click calls method addIncorrectAnswer and adds a new empty wrong answer field to the end', () => {
    wrapper.setState({ incorrectAnswers: ['eka', 'toka', 'kolmas'] })
    const spy = jest.spyOn(wrapper.instance(), 'addIncorrectAnswer')
    wrapper.instance().forceUpdate()
    const button = wrapper.find('.addButton')
    button.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.wrongAnswerField').length).toBe(4)
    expect(wrapper.find('.wrongAnswerField').at(3).props().value).toEqual('')
    for (let i = 0; i < 10; i++) {
      button.simulate('click')
      expect(spy).toHaveBeenCalledTimes(2 + i)
      expect(wrapper.find('.wrongAnswerField').length).toBe(5 + i)
    }
  })
  it('delete wrong answer button click calls method removeIncorrectAnswer and removes the last wrong answer field', () => {
    wrapper.setState({ incorrectAnswers: ['eka', 'toka', 'kolmas'] })
    const spy = jest.spyOn(wrapper.instance(), 'removeIncorrectAnswer')
    wrapper.instance().forceUpdate()
    const button = wrapper.find('.deleteButton')
    button.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.wrongAnswerField').length).toBe(2)
    expect(wrapper.state().incorrectAnswers).toEqual([ 'eka', 'toka' ])
    button.simulate('click')
    expect(spy).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.wrongAnswerField').length).toBe(1)
    expect(wrapper.state().incorrectAnswers).toEqual([ 'eka' ])
    button.simulate('click')
    expect(spy).toHaveBeenCalledTimes(3)
    expect(wrapper.find('.wrongAnswerField').length).toBe(0)
    expect(wrapper.state().incorrectAnswers).toEqual([])
    button.simulate('click')
    expect(spy).toHaveBeenCalledTimes(4)
    expect(wrapper.find('.wrongAnswerField').length).toBe(0)
    expect(wrapper.state().incorrectAnswers).toEqual([])
  })
  it('save button click should call method handleSave', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleSave')
    // forceUpdate() on tärkeä, samoin järjestys!
    wrapper.instance().forceUpdate()
    const button = wrapper.find('.saveButton')
    button.simulate('click')
    expect(spy).toHaveBeenCalled()
  })
  it('addIncorrectAnswer sets correct state', () => {
    wrapper.setState(initialState)
    wrapper.instance().addIncorrectAnswer()
    expect(wrapper.state()).toEqual({
      ...initialState,
      incorrectAnswers: ['', '', '', '']
    })
  })
  it('handleArrayChange sets the correct state', () => {
    wrapper.setState(initialState)
    let field = wrapper.find('.wrongAnswerField').at(2)
    field.simulate('change', { target: { value: 'uus arvo' } })
    expect(wrapper.state()).toEqual({
      ...initialState,
      incorrectAnswers: ['', '', 'uus arvo']
    })
    field = wrapper.find('.wrongAnswerField').at(0)
    field.simulate('change', { target: { value: 'eka arvo' } })
    expect(wrapper.state()).toEqual({
      ...initialState,
      incorrectAnswers: ['eka arvo', '', 'uus arvo']
    })
  })
  describe('handleSave', () => {
    let state
    const fieldsFilled = {
      questionType: 'tulostaa',
      question: 'not null',
      correctAnswer: 'eka',
      incorrectAnswers: ['1', '2', '3'],
      course: 'test',
      groupId: 'test'
    }
    beforeEach(() => {
      props.postCompileQuestion.mockClear()
      props.postPrintQuestion.mockClear()
    })
    it('does nothing if questionType === \'\'', () => {
      state = {
        ...fieldsFilled,
        questionType: ''
      }
      wrapper.setState(state)
      wrapper.instance().handleSave()
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(0)
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(0)
      expect(wrapper.state()).toEqual(state)
    })
    it('does nothing if question === \'\' amd questionType !== \'kääntyy\'', () => {
      state = {
        ...fieldsFilled,
        questionType: 'tulostaa',
        question: ''
      }
      wrapper.setState(state)
      wrapper.instance().handleSave()
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(0)
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(0)
      expect(wrapper.state()).toEqual(state)
    })
    it('does nothing if correctAnswer === \'\'', () => {
      state = {
        ...fieldsFilled,
        correctAnswer: ''
      }
      wrapper.setState(state)
      wrapper.instance().handleSave()
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(0)
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(0)
      expect(wrapper.state()).toEqual(state)
    })
    it('does nothing if one of incorrectAnswers is \'\'', () => {
      state = {
        ...fieldsFilled,
        incorrectAnswers: ['eka', '', 'toka']
      }
      wrapper.setState(state)
      wrapper.instance().handleSave()
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(0)
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(0)
      expect(wrapper.state()).toEqual(state)
    })
    it('calls postPrintQuestion when state is correct and initializes state', () => {
      wrapper.setState(fieldsFilled)
      wrapper.instance().handleSave()
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(0)
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(1)
      expect(props.postPrintQuestion).toHaveBeenCalledWith(fieldsFilled.question, fieldsFilled.correctAnswer, fieldsFilled.incorrectAnswers)
      expect(wrapper.state()).toEqual({ ...initialState })
    })
    it('calls postCompileQuestion when state is correct and initializes state', () => {
      wrapper.setState({
        ...fieldsFilled,
        questionType: 'kääntyy'
      })
      wrapper.instance().handleSave()
      expect(props.postPrintQuestion).toHaveBeenCalledTimes(0)
      expect(props.postCompileQuestion).toHaveBeenCalledTimes(1)
      expect(props.postCompileQuestion).toHaveBeenCalledWith(fieldsFilled.correctAnswer, fieldsFilled.incorrectAnswers)
      expect(wrapper.state()).toEqual({ ...initialState })
    })
  })
  */
})
