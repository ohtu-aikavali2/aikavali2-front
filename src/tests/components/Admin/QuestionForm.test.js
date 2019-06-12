
import React from 'react'
import { shallow } from 'enzyme'
import { QuestionForm } from '../../../app/components/Admin/QuestionForm'
import Select from '@material-ui/core/Select'
import { Button, FormControlLabel, Card, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

describe('<QuestionForm />', () => {
  const initialState = {
    course: '',
    groupId: '',
    questionType: '',
    question: '',
    answerOptions: [],
    step: 0,
    courses: [],
    questions: [],
    concepts: [],
    modalOpen: false,
    selectedValue: '',
    selectedValueForRadioButton: ''
  }
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
  it('radiobutton labels are rendered correctly', () => {
    let radioFirst = wrapper.find(FormControlLabel).first().prop('label')
    expect(radioFirst).toEqual('Voi valita yhden vastauksen')
    let radioSecond = wrapper.find(FormControlLabel).at(1).prop('label')
    expect(radioSecond).toEqual('Voi valita monta vastausta')
  })
  it('answer fields are not rendered until clicked \'+Lisää vastausvaihto\' and click calls addAnswerOption method', () => {
    expect(wrapper.find('.answerField').length).toBe(0)
    const spy = jest.spyOn(wrapper.instance(), 'addAnswerOption')
    wrapper.instance().forceUpdate()
    let addNewButton = wrapper.find('.addButtonContainer').find(Button)
    addNewButton.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.answerField').length).toBe(1)
  })
  it('adding new answer option updates the state', () => {
    wrapper.setState({ answerOptions: [] })
    let addNewButton = wrapper.find('.addButtonContainer').find(Button)
    addNewButton.simulate('click')
    expect(wrapper.find('.answerField').length).toBe(1)
    expect(wrapper.state().answerOptions).toEqual([ { cardId: 0, value: '', checked: false } ])
    addNewButton.simulate('click')
    expect(wrapper.find('.answerField').length).toBe(2)
    expect(wrapper.state().answerOptions[1]).toEqual({ cardId: 1, value: '', checked: false })
  })
  it('only six answer fields and cards can be created', () => {
    wrapper.setState({ answerOptions: [] })
    expect(wrapper.find('.answerField').length).toBe(0)
    let addNewButton = wrapper.find('.addButtonContainer').find(Button)
    for (let i = 0; i < 10; i++) {
      addNewButton.simulate('click')
    }
    expect(wrapper.find('.answerField').length).toBe(6)
    expect(wrapper.find(Card).length).toBe(6)
  })
  it('user input to answer field calls method handleArrayChange and the value is updated to state', () => {
    wrapper.setState({ answerOptions: [] })
    let addNewButton = wrapper.find('.addButtonContainer').find(Button)
    const spy = jest.spyOn(wrapper.instance(), 'handleArrayChange')
    addNewButton.simulate('click')
    let field = wrapper.find('.answerField')
    field.simulate('change', { target: { value: 'option' } })
    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().answerOptions).toEqual([ { cardId: 0, value: 'option', checked: false } ])
  })
  it('cards are formed properly and they contain close icon and correct checkbox label', () => {
    expect(wrapper.find(Card).length).toBe(1)
    expect(wrapper.find(FormControlLabel).at(2).props().label).toEqual('Oikea vastaus')
    expect(wrapper.find(CloseIcon).length).toBe(1)
  })
  it('user input to specific answer field calls method handleArrayChange and sets correct values to state', () => {
    wrapper.setState({
      answerOptions: [
        { cardId: 0, value: 'wrong', checked: false },
        { cardId: 1, value: '', checked: false },
        { cardId: 2, value: 'correct', checked: true }
      ]
    })
    const spy = jest.spyOn(wrapper.instance(), 'handleArrayChange')
    let field = wrapper.find('.answerField').at(1)
    field.simulate('change', { target: { value: 'changedValue' } })
    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().answerOptions).toEqual([{ cardId: 0, value: 'wrong', checked: false },
      { cardId: 1, value: 'changedValue', checked: false },
      { cardId: 2, value: 'correct', checked: true }])
    expect(wrapper.find(Card).length).toBe(3)
  })
  it('cards can be deleted and array is updated to state accordingly', () => {
    // This check removes the second element of previously created array
    const spy = jest.spyOn(wrapper.instance(), 'removeAnswerOption')
    const button = wrapper.find(IconButton).at(1)
    button.simulate('click')
    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().answerOptions).toEqual([{ cardId: 0, value: 'wrong', checked: false },
      { cardId: 1, value: 'correct', checked: true }])
  })
  it('stepbar buttons are rendered correctly', () => {
    wrapper.setState(initialState)
    const firstButton = wrapper.find('.stepperButtonContainer').find(Button).first()
    // const secondButton = wrapper.find('.stepperButtonContainer').find(Button).at(1)
    const thirdButton = wrapper.find('.stepperButtonContainer').find(Button).at(2)
    expect(firstButton.prop('disabled')).toBe(true)
    expect(thirdButton.prop('className')).toEqual('forwardButton')
    // state needs to be set because notifications won't allow to continue if conditions are not met
    wrapper.setState({ course: c, groupId: c.groups[0] })
    const spy = jest.spyOn(wrapper.instance(), 'stepForward')
    thirdButton.simulate('click')
    expect(spy).toHaveBeenCalled()
    expect(wrapper.state().step).toBe(1)
  })
  /*
  it('save button is rendered', () => {
    expect(wrapper.find('.saveButton').length).toBe(1)
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
