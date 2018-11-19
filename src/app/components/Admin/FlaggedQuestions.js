import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlaggedQuestionsTable from './FlaggedQuestionsTable'
import Popup from '../common/Popup'
import AlertWindow from '../common/AlertWindow'
import Button from '@material-ui/core/Button'
import { deleteQuestions } from '../../reducers/actions/questionActions'

class FlaggedQuestions extends Component {
  constructor () {
    super()
    this.state = {
      showDeleteAlert: false,
      showDeleteSuccesfulAlert: false,
      showUnflagAlert: false,
      showUnflagSuccessfulAlert: false,
      selected: []
    }
  }

  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false })
  }
  closeUnflagAlert = () => {
    this.setState({ showUnflagAlert: false })
  }
  closeDeleteSuccessfulAlert = () => {
    this.setState({ showDeleteSuccesfulAlert: false })
  }
  closeUnflagSuccessfulAlert = () => {
    this.setState({ showUnflagSuccessfulAlert: false })
  }

  /* --------- Click handlers passed to child component ---------- */
  handleDeleteClick = (selected) => {
    this.setState({ showDeleteAlert: true, selected: selected })
  }
  handleUnflagClick = (selected) => {
    this.setState({ showUnflagAlert: true, selected: selected })
  }

  /* ------------- The actual actions ------------- */
  handleDelete = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s.item._id))
    await this.props.deleteQuestions(questionIDs)
    this.setState({ showDeleteAlert: false, showDeleteSuccesfulAlert: true })
  }
  handleUnflag = () => {
    this.setState({ showUnflagAlert: false , showUnflagSuccessfulAlert: true })
  }

  /* ------------------ Popup windows ------------------- */
  deletePopup = () => {
    return (
      <Popup toggle={this.closeDeleteAlert}>
        <AlertWindow title='Oletko varma?'>
          <div style={{ marginTop: 20 }}>
            <p>Haluatko varmasti poistaa valitut ({this.state.selected.length} kpl) kysymykset?</p>
            <p style={{ marginTop: 20, fontSize: 12 }}>Poistamalla kysymyksen, se poistetaan tietokannasta, eikä sitä näytetä enää käyttäjille.</p>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <Button onClick={this.handleDelete}>
                Poista
              </Button>
              <Button onClick={this.closeDeleteAlert}>
                Peruuta
              </Button>
            </div>
          </div>
        </AlertWindow>
      </Popup>
    )
  }
  deleteSuccessfulPopup = () => {
    return (
      <Popup toggle={this.closeDeleteSuccessfulAlert}>
        <AlertWindow title={`${this.state.selected.length} kysymystä poistettu!`}>
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={this.closeDeleteSuccessfulAlert}>
                Ok
              </Button>
            </div>
          </div>
        </AlertWindow>
      </Popup>
    )
  }
  unflagPopup = () => {
    return (
      <Popup toggle={this.closeUnflagAlert}>
        <AlertWindow title='Oletko varma?'>
          <div style={{ marginTop: 20 }}>
            <p>Haluatko varmasti poistaa valitut ({this.state.selected.length} kpl) kysymykset ilmiannetuista kysymyksistä?</p>
            <p style={{ marginTop: 20, fontSize: 12 }}>Painamalla KYLLÄ, kysymyksen ilmiannot nollataan ja kysymystä esitetään edelleen käyttäjille.</p>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <Button onClick={this.handleUnflag}>
                Kyllä
              </Button>
              <Button onClick={this.closeUnflagAlert}>
                Peruuta
              </Button>
            </div>
          </div>
        </AlertWindow>
      </Popup>
    )
  }
  unflagSuccessfulPopup = () => {
    return (
      <Popup toggle={this.closeUnflagSuccessfulAlert}>
        <AlertWindow title={`${this.state.selected.length} kysymyksen ilmiannot nollattu!`}>
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={this.closeUnflagSuccessfulAlert}>
                Ok
              </Button>
            </div>
          </div>
        </AlertWindow>
      </Popup>
    )
  }
  render () {
    return (
      <div className='flaggedQuestionsContainer'>
        <FlaggedQuestionsTable handleDelete={this.handleDeleteClick} handleUnflag={this.handleUnflagClick} />
        {this.state.showDeleteAlert && this.deletePopup()}
        {this.state.showDeleteSuccesfulAlert && this.deleteSuccessfulPopup()}
        {this.state.showUnflagAlert && this.unflagPopup()}
        {this.state.showUnflagSuccessfulAlert && this.unflagSuccessfulPopup()}
      </div>
    )
  }
}

const mapDispatchToProps = {
  deleteQuestions
}

export default connect(null, mapDispatchToProps)(FlaggedQuestions)
