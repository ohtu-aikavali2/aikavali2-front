import React from 'react'
import { mount } from 'enzyme'
import QuestionForm from '../../../app/components/Admin/QuestionForm'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import MenuItem from '@material-ui/core/MenuItem'

describe('QuestionForm', () => {
  let wrapper
  it('renders self and subcomponents', () => {
    wrapper = mount(<QuestionForm />)
    expect(wrapper.find('.questionFormContainer').length).toBe(1)
    expect(wrapper.find('form').length).toBe(1)
    const textFields = wrapper.find(TextField)
    expect(textFields.length).toBe(4)
    expect(textFields.at(0).hasClass('questionType')).toBe(true)
    expect(textFields.at(0).props().select).toBe(true)
    expect(textFields.at(1).hasClass('questionField')).toBe(true)
    expect(textFields.at(2).hasClass('rightAnswerField')).toBe(true)
    expect(textFields.at(3).hasClass('wrongAnswerField')).toBe(true)

    // At start
    expect(wrapper.find(MenuItem).length).toBe(0)

    const buttons = wrapper.find(Button)
    expect(buttons.length).toBe(2)
    const addButton = buttons.first()
    expect(addButton.find(AddIcon).length).toBe(1)
    const saveButton = buttons.at(1)
    expect(saveButton.text()).toContain('Save')
    expect(saveButton.find(SaveIcon).length).toBe(1)
  })
  describe('question type field', () => {
    let field
    beforeAll(() => {
      field = wrapper.find(TextField).first()
    })
    it('has the correct options', () => {
      expect(field.props().children[0].props.children).toEqual('valitse mikä koodeista kääntyy')
      expect(field.props().children[1].props.children).toEqual('valitse mitä koodi tulostaa')
    })
    it('value is empty at start', () => {
      expect(field.props().value).toEqual('')
    })
    /*
    // Joo tää on aivan mahdoton material.uilla
    it('handles value change', () => {
      console.log(wrapper.find(TextField).at(0).find('Select').find('SelectInput').children().debug())
      wrapper.find(TextField).at(0).find('Select').find('SelectInput').simulate('change', { target: { value: 'PASKA' } })
      expect(wrapper.state().questionType).toEqual('PASKA')
    })*/
  })
  describe('question field', () => {
    let field
    beforeAll(() => {
      field = wrapper.find(TextField).at(1)
    })
    it('value is empty at start', () => {
      expect(field.props().value).toEqual('')
    })
    it('changes the value when given input', () => {
      // Siis oikeesti tää Material.UI...........
      wrapper.find(TextField).at(1).find('textarea').at(2).simulate('change', { target: { value: 'PASKA' } })
      expect(wrapper.state().question).toEqual('PASKA')
    })
  })
  it('saveButton click calls handleSave method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleSave')

    // forceUpdate for instance() is NEEDED!!
    wrapper.instance().forceUpdate()
    let saveButton = wrapper.find(Button).at(1)
    saveButton.simulate('click')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
