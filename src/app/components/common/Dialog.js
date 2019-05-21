import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class SimpleDialog extends React.Component {

  handleClose = () => {
    this.props.onClose('')
  }
  handleListItemClick = value => {
    this.props.onClose(value)
  }

  render() {
    const { onClose, selectedValue, questions, ...other } = this.props
    console.log(selectedValue)
    console.log(onClose)
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Valitse kysymys</DialogTitle>
        <div>
          <List>
            {questions.map(question => (
              <ListItem button onClick={() => this.handleListItemClick(question.question.item.value)} key={question._id}>
                <ListItemText primary={question.question.item.value} />
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