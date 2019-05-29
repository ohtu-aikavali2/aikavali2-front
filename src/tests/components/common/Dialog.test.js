import React from 'react'
import { shallow } from 'enzyme'
import SimpleDialog from '../../../app/components/common/Dialog'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'

describe('Dialog', () => {
  let dialog, props
  let q = [
    {
      question: {
        kind: 'GeneralQuestion',
        item: {
          options: [
            'option1',
            'option2',
            'option3'
          ],
          value: 'testquestion',
          _id: '06660'
        },
        _id: '4321'
      }

    }
  ]
  beforeAll(() => {
    props = {
      open: jest.fn(),
      onClose: jest.fn(),
      selectedValue: '',
      questions: q
    }
    dialog = shallow(<SimpleDialog {...props} />)
  })
  it('renders self', () => {
    expect(dialog.find('.dialog').length).toBe(1)
  })
  it('renders title', () => {
    const dialogTitle = dialog.find(DialogTitle)
    expect(dialogTitle.length).toBe(1)
  })
  it('renders content', () => {
    expect(dialog.find(List).find(ListItem).find(ListItemText).props().primary).toBe('testquestion')
  })
})