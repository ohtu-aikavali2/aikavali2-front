import React, { Component } from 'react'
import { connect } from 'react-redux'
import EpicTable from '../common/EpicTable/EpicTable'
import AlertWindow from '../common/AlertWindow'
import DumbQuestion from '../Question/DumbQuestion'
import SuccessPopup from './Popups/SuccessPopup'
import ConfirmPopup from './Popups/ConfirmPopup'
import Loading from '../common/Loading'
import {
  deleteQuestions,
  getAvailableQuestions,
  unflagQuestions,
  getDeletedQuestions,
  restoreQuestions,
  getAllFlaggedQuestions
} from '../../reducers/actions/questionActions'

// disablePadding false, will left-align the rows with the row header
// numeric does nothing at the moment. Could be used in sorting
// (if numeric true, add everything containing letters last. Check "Viimeisin ilmianto")
const rows = [
  { id: 'value', numeric: false, disablePadding: false, label: 'Kysymys' },
  { id: 'course', numeric: false, disablePadding: false, label: 'Kurssi' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Viikko' },
  { id: 'flags', numeric: true, disablePadding: true, label: 'Ilmiantoja' },
  { id: 'reviews', numeric: true, disablePadding: true, label: 'Arvosteluja' },
  { id: 'recentFlag', numeric: true, disablePadding: true, label: 'Viimeisin ilmianto' },
  { id: 'averageRating', numeric: true, disablePadding: true, label: 'Average rating' }
]

class Questions extends Component {
  constructor () {
    super()
    this.state = {
      showDeleteAlert: false,
      showDeleteSuccesfulAlert: false,
      showUnflagAlert: false,
      showUnflagSuccessfulAlert: false,
      showRestoreAlert: false,
      showRestoreSuccesfulAlert: false,
      selected: [],
      checked: 0
    }
  }

  async componentDidMount () {
    if (this.props.available) {
      await this.props.getAvailableQuestions()
    } else if (this.props.deleted) {
      await this.props.getDeletedQuestions()
    } else if (this.props.flagged) {
      await this.props.getAllFlaggedQuestions()
    } else {
      await this.props.getAvailableQuestions()
    }
  }
  updateCheckCount = (count) => {
    this.setState({ checked: count })
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
  closeRestoreAlert = () => {
    this.setState({ showRestoreAlert: false })
  }
  closeRestoreSuccessfulAlert = () => {
    this.setState({ showRestoreSuccesfulAlert: false })
  }

  /* --------- Click handlers passed to child component ---------- */
  handleDeleteClick = (selected) => {
    this.setState({ showDeleteAlert: true, selected: selected })
  }
  handleUnflagClick = (selected) => {
    this.setState({ showUnflagAlert: true, selected: selected })
  }
  handleRestoreClick = (selected) => {
    this.setState({ showRestoreAlert: true, selected: selected })
  }

  /* ------------- The actual actions ------------- */
  handleDelete = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s._id))
    await this.props.deleteQuestions(questionIDs)
    this.setState({ showDeleteAlert: false, showDeleteSuccesfulAlert: true })
  }
  handleUnflag = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s._id))
    await this.props.unflagQuestions(questionIDs)
    this.setState({ showUnflagAlert: false , showUnflagSuccessfulAlert: true })
    // To update the flags
    await this.props.getAvailableQuestions()
  }
  handleRestore = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s._id))
    await this.props.restoreQuestions(questionIDs)
    this.setState({ showRestoreAlert: false, showRestoreSuccesfulAlert: true })
  }

  // Has to have id AND no inner fields like { item: { value: 'something' } } -> { value: 'comething' }
  // ALSO has to have _id for determing the expanding content
  optimizeData = (array) => {
    let data = []
    let counter = 0
    array.forEach(q => {
      counter += 1
      data.push({
        id: counter,
        value: q.question.kind === 'PrintQuestion' ? q.question.item.value : 'Mikä kääntyy?',
        course: q.group ? q.group.course ? q.group.course.name : 'ei määritelty' : 'ei määritelty',
        group: q.group ? q.group.name : 'ei määritelty',
        flags: q.flags.length,
        reviews: q.reviews.length,
        recentFlag: !q.recentFlag ? 'no flags' : new Date(q.recentFlag).toLocaleDateString(),
        _id: q._id,
        averageRating: Number(q.averageRating).toFixed(2)
      })
    })
    return data
  }
  expandableContent = (id) => {
    const question = this.props.questions.find(q => q._id === id)
    return (
      <AlertWindow neutral>
        <DumbQuestion question={question.question} correctAnswer={question.correctAnswer.value} />
      </AlertWindow>
    )
  }
  render () {
    const { available, flagged, deleted } = this.props
    let toolbarButton1Text = 'Nollaa ilmiannot'
    let toolbarButton2Text = ''
    let title = ''
    let defaultOrder = ''
    if (available) {
      title = 'Käytössä olevat kysymykset'
      defaultOrder = 'averageRating'
      if (this.state.checked > 1) {
        toolbarButton2Text = 'Poista kysymykset'
      } else {
        toolbarButton2Text = 'Poista kysymys'
      }
    } else if (flagged) {
      title = 'Ilmiannetut kysymykset'
      defaultOrder = 'flags'
      if (this.state.checked > 1) {
        toolbarButton2Text = 'Poista kysymykset'
      } else {
        toolbarButton2Text = 'Poista kysymys'
      }
    } else {
      title = 'Poistetut kysymykset'
      defaultOrder = 'flags'
      if (this.state.checked > 1) {
        toolbarButton2Text = 'Palauta kysymykset'
      } else {
        toolbarButton2Text = 'Palauta kysymys'
      }
    }
    return (
      <div className='flaggedQuestionsContainer'>
        <EpicTable
          toolbarButton1Click={this.handleUnflagClick}
          toolbarButton2Click={(available || flagged) ? this.handleDeleteClick : this.handleRestoreClick}
          data={this.optimizeData(this.props.questions)}
          rows={rows}
          expandable
          expandableContent={this.expandableContent}
          defaultOrder={defaultOrder}
          title={title}
          toolbarButton1Text={toolbarButton1Text}
          toolbarButton2Text={toolbarButton2Text}
          toolbarButton1Tooltip={toolbarButton1Text}
          toolbarButton2Tooltip={toolbarButton2Text}
          updateCheckCount={this.updateCheckCount}
        />
        {(available || flagged) && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti poistaa valitut (${this.state.selected.length} kpl) kysymykset?`} description2={'Poistamalla kysymyksen, sitä ei näytetä enää käyttäjille. Voit palauttaa kysymyksen myöhemmin käyttöön mikäli haluat.'} okClick={this.handleDelete} okText={'Poista'} toggle={this.closeDeleteAlert} checked={this.state.showDeleteAlert} />}
        {(available || flagged) && <SuccessPopup title={`${this.state.selected.length} kysymystä poistettu!`} toggle={this.closeDeleteSuccessfulAlert} checked={this.state.showDeleteSuccesfulAlert} />}
        {deleted && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti poistaa valitut (${this.state.selected.length} kpl) kysymykset ilmiannetuista kysymyksistä?`} description2={'Painamalla KYLLÄ, kysymyksen ilmiannot nollataan, mutta kysymystä ei esitetetä käyttäjille, kunnes se palautetaan käyttöön.'} okClick={this.handleUnflag} okText={'Kyllä'} toggle={this.closeUnflagAlert} checked={this.state.showUnflagAlert} />}
        {!deleted && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti poistaa valitut (${this.state.selected.length} kpl) kysymykset ilmiannetuista kysymyksistä?`} description2={'Painamalla KYLLÄ, kysymyksen ilmiannot nollataan ja kysymystä esitetään edelleen käyttäjille.'} okClick={this.handleUnflag} okText={'Kyllä'} toggle={this.closeUnflagAlert} checked={this.state.showUnflagAlert} />}
        <SuccessPopup title={`${this.state.selected.length} kysymyksen ilmiannot nollattu!`} toggle={this.closeUnflagSuccessfulAlert} checked={this.state.showUnflagSuccessfulAlert} />
        {deleted && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti palauttaa valitut (${this.state.selected.length} kpl) kysymykset käyttöön?`} description2={'Palauttamisen jälkeen kysymystä ruvetaan näyttämään käyttäjille.'} okClick={this.handleRestore} okText={'Palauta'} toggle={this.closeRestoreAlert} checked={this.state.showRestoreAlert} />}
        {deleted && <SuccessPopup title={`${this.state.selected.length} kysymystä palautettu käyttöön!`} toggle={this.closeRestoreSuccessfulAlert} checked={this.state.showRestoreSuccesfulAlert} />}
        {this.props.loading && <Loading />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    questions: ownProps.available ? state.question.questions : ownProps.deleted ? state.question.deletedQuestions : ownProps.flagged ? state.question.flaggedQuestions : state.question.questions,
    loading: state.question.loading
  }
}

const mapDispatchToProps = {
  getAvailableQuestions,
  deleteQuestions,
  unflagQuestions,
  getDeletedQuestions,
  restoreQuestions,
  getAllFlaggedQuestions
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
