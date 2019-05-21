import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class ConceptDialog extends React.Component {

  handleClose = () => {
    this.props.onClose('')
  }
  handleListItemClick = value => {
    this.props.onClose(value)
  }

  render() {
    const { onClose, selectedValue, concepts, ...other } = this.props
    console.log(selectedValue)
    console.log(onClose)
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="concept-title" {...other}>
        <DialogTitle id="concept-title">Valitse konsepti</DialogTitle>
        <div>
          <List>
            {concepts.map(concept => (
              <ListItem button onClick={() => this.handleListItemClick(concept)} key={concept}>
                <ListItemText primary={concept} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}

ConceptDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
}

export default ConceptDialog