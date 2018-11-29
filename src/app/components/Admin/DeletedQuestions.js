import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlaggedQuestionsTable from './FlaggedQuestionsTable'
import AlertWindow from '../common/AlertWindow'
import DumbQuestion from '../Question/DumbQuestion'
import SuccessPopup from './Popups/SuccessPopup'
import ConfirmPopup from './Popups/ConfirmPopup'
import { getDeletedQuestions, unflagQuestions, restoreQuestions } from '../../reducers/actions/questionActions'

const rows = [
  { id: 'value', numeric: false, disablePadding: false, label: 'Kysymys' },
  { id: 'course', numeric: false, disablePadding: false, label: 'Kurssi' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Viikko' },
  { id: 'flags', numeric: true, disablePadding: false, label: 'Ilmiantoja' },
  { id: 'recentFlag', numeric: true, disablePadding: false, label: 'Viimeisin ilmianto' },
  { id: 'averageRating', numeric: true, disablePadding: false, label: 'Average rating' }
]

class DeletedQuestions extends Component {
  constructor () {
    super()
    this.state = {
      showRestoreAlert: false,
      showRestoreSuccesfulAlert: false,
      showUnflagAlert: false,
      showUnflagSuccessfulAlert: false,
      selected: [],
      checked: 0
    }
  }

  async componentDidMount () {
    await this.props.getDeletedQuestions()
  }

  updateCheckCount = (count) => {
    this.setState({ checked: count })
  }

  closeRestoreAlert = () => {
    this.setState({ showRestoreAlert: false })
  }
  closeUnflagAlert = () => {
    this.setState({ showUnflagAlert: false })
  }
  closeRestoreSuccessfulAlert = () => {
    this.setState({ showRestoreSuccesfulAlert: false })
  }
  closeUnflagSuccessfulAlert = () => {
    this.setState({ showUnflagSuccessfulAlert: false })
  }

  /* --------- Click handlers passed to child component ---------- */
  handleRestoreClick = (selected) => {
    this.setState({ showRestoreAlert: true, selected: selected })
  }
  handleUnflagClick = (selected) => {
    this.setState({ showUnflagAlert: true, selected: selected })
  }

  /* ------------- The actual actions ------------- */
  handleRestore = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s._id))
    await this.props.restoreQuestions(questionIDs)
    this.setState({ showRestoreAlert: false, showRestoreSuccesfulAlert: true })
  }
  handleUnflag = async () => {
    let questionIDs = []
    this.state.selected.forEach(s => questionIDs.push(s._id))
    await this.props.unflagQuestions(questionIDs)
    this.setState({ showUnflagAlert: false , showUnflagSuccessfulAlert: true })
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
        recentFlag: !q.recentFlag ? 'no flags' : new Date(q.recentFlag).toLocaleDateString(),
        _id: q._id,
        averageRating: q.averageRating
      })
    })
    return data
  }
  expandableContent = (id) => {
    const question = this.props.deletedQuestions.find(q => q._id === id)
    return (
      <AlertWindow neutral>
        <DumbQuestion question={question.question} correctAnswer={question.correctAnswer.value} />
      </AlertWindow>
    )
  }
  render () {
    return (
      <div className='flaggedQuestionsContainer'>
        <FlaggedQuestionsTable
          toolbarButton1Click={this.handleUnflagClick}
          toolbarButton2Click={this.handleRestoreClick}
          data={this.optimizeData(this.props.deletedQuestions)}
          rows={rows}
          expandable
          expandableContent={this.expandableContent}
          defaultOrder={'flags'}
          title={'Poistetut kysymykset'}
          toolbarButton1Text={'Nollaa ilmiannot'}
          toolbarButton1Tooltip={'Nollaa ilmiannot'}
          toolbarButton2Text={this.state.checked > 1 ? 'Palauta kysymykset' : 'Palauta kysymys'}
          toolbarButton2Tooltip={this.state.checked > 1 ? 'Palauta kysymykset' : 'Palauta kysymys'}
          updateCheckCount={this.updateCheckCount}
        />
        {this.state.showRestoreAlert && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti palauttaa valitut (${this.state.selected.length} kpl) kysymykset käyttöön?`} description2={'Palauttamisen jälkeen kysymystä ruvetaan näyttämään käyttäjille.'} okClick={this.handleRestore} okText={'Palauta'} toggle={this.closeRestoreAlert} />}
        {this.state.showRestoreSuccesfulAlert && <SuccessPopup title={`${this.state.selected.length} kysymystä palautettu käyttöön!`} toggle={this.closeRestoreSuccessfulAlert} />}
        {this.state.showUnflagAlert && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti nollata valittujen (${this.state.selected.length} kpl) kysymysten ilmiannot?`} description2={'Painamalla KYLLÄ, kysymyksen ilmiannot nollataan, mutta kysymystä ei näytetä käyttäjille ennen kuin se palautetaan.'} okClick={this.handleUnflag} okText={'Kyllä'} toggle={this.closeUnflagAlert} />}
        {this.state.showUnflagSuccessfulAlert && <SuccessPopup title={`${this.state.selected.length} kysymyksen ilmiannot nollattu!`} toggle={this.closeUnflagSuccessfulAlert} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    deletedQuestions: state.question.deletedQuestions
  }
}

const mapDispatchToProps = {
  getDeletedQuestions,
  unflagQuestions,
  restoreQuestions
}

export default connect(mapStateToProps, mapDispatchToProps)(DeletedQuestions)