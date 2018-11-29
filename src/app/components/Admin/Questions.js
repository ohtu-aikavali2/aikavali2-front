import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlaggedQuestionsTable from './FlaggedQuestionsTable'
import AlertWindow from '../common/AlertWindow'
import DumbQuestion from '../Question/DumbQuestion'
import SuccessPopup from './Popups/SuccessPopup'
import ConfirmPopup from './Popups/ConfirmPopup'
import { deleteQuestions, getAvailableQuestions, unflagQuestions } from '../../reducers/actions/questionActions'

const rows = [
  { id: 'value', numeric: false, disablePadding: false, label: 'Kysymys' },
  { id: 'course', numeric: false, disablePadding: false, label: 'Kurssi' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Viikko' },
  { id: 'flags', numeric: true, disablePadding: false, label: 'Ilmiantoja' },
  { id: 'recentFlag', numeric: true, disablePadding: false, label: 'Viimeisin ilmianto' },
  { id: 'averageRating', numeric: true, disablePadding: false, label: 'Average rating' }
]

class Questions extends Component {
  constructor () {
    super()
    this.state = {
      showDeleteAlert: false,
      showDeleteSuccesfulAlert: false,
      showUnflagAlert: false,
      showUnflagSuccessfulAlert: false,
      selected: [],
      checked: 0
    }
  }

  async componentDidMount () {
    await this.props.getAvailableQuestions()
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
    const question = this.props.questions.find(q => q._id === id)
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
          toolbarButton2Click={this.handleDeleteClick}
          data={this.optimizeData(this.props.questions)}
          rows={rows}
          expandable
          expandableContent={this.expandableContent}
          defaultOrder={'averageRating'}
          title={'Käytössä olevat kysymykset'}
          toolbarButton1Text={'Nollaa ilmiannot'}
          toolbarButton2Text={this.state.checked > 1 ? 'Poista kysymykset' : 'Poista kysymys'}
          toolbarButton1Tooltip={'Nollaa ilmiannot'}
          toolbarButton2Tooltip={this.state.checked > 1 ? 'Poista kysymykset' : 'Poista kysymys'}
          updateCheckCount={this.updateCheckCount}
        />
        {this.state.showDeleteAlert && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti poistaa valitut (${this.state.selected.length} kpl) kysymykset?`} description2={'Poistamalla kysymyksen, sitä ei näytetä enää käyttäjille. Voit palauttaa kysymyksen myöhemmin käyttöön mikäli haluat.'} okClick={this.handleDelete} okText={'Poista'} toggle={this.closeDeleteAlert} />}
        {this.state.showDeleteSuccesfulAlert && <SuccessPopup title={`${this.state.selected.length} kysymystä poistettu!`} toggle={this.closeDeleteSuccessfulAlert} />}
        {this.state.showUnflagAlert && <ConfirmPopup title={'Oletko varma?'} description1={`Haluatko varmasti poistaa valitut (${this.state.selected.length} kpl) kysymykset ilmiannetuista kysymyksistä?`} description2={'Painamalla KYLLÄ, kysymyksen ilmiannot nollataan ja kysymystä esitetään edelleen käyttäjille.'} okClick={this.handleUnflag} okText={'Kyllä'} toggle={this.closeUnflagAlert} />}
        {this.state.showUnflagSuccessfulAlert && <SuccessPopup title={`${this.state.selected.length} kysymyksen ilmiannot nollattu!`} toggle={this.closeUnflagSuccessfulAlert} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.question.questions
  }
}

const mapDispatchToProps = {
  getAvailableQuestions,
  deleteQuestions,
  unflagQuestions
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
