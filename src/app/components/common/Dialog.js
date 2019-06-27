import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class SimpleDialog extends React.Component {

  sortQuestions = questions => {
    // map to text values
    const questionItems = questions.map(question => question.question.item.value)
    // creates a map which includes counts and text values of questions
    const uniqueItemsWithCounts = questionItems.reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map())
    // sorts the map by their counts and then stores the keys to sortedQuestions
    const sortedQuestions = new Map([...uniqueItemsWithCounts.entries()].sort((a, b) => b[1] - a[1])).keys()
    // creates an array of the map and returns top 5 questions
    return Array.from(sortedQuestions).slice(0, 5)
  }

  render() {
    const { onClose, selectedValue, questions, ...other } = this.props
    const handleClose = () => {
      onClose('')
    }
    const handleListItemClick = value => {
      onClose(selectedValue)
      onClose(value)
    }
    return (
      <Dialog className='dialog' onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Valitse kysymys</DialogTitle>
        <div>
          <List>
            {this.sortQuestions(questions).map(question => (
              <ListItem button onClick={() => handleListItemClick(question)} key={question}>
                <ListItemText primary={question} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
}

export default SimpleDialog