import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Popup from '../common/Popup'
import AlertWindow from '../common/AlertWindow'
import DumbQuestion from '../Question/DumbQuestion'

class FlaggedQuestionsTable extends Component {
  constructor () {
    super()
    this.state = {
      byCourse: false,
      showQuestion: null
    }
  }

  componentDidMount () {
    if (this.props.history.location.pathname.indexOf('/admin/flags/courses') !== -1) {
      this.setState({ byCourse: true })
    }
  }

  toggleShowQuestion = (question) => {
    if (!question) {
      this.setState({ showQuestion: null })
    } else {
      this.setState({ showQuestion: question })
    }
  }

  renderTable = (array) => {
    let table = []
    table.push(
      <tr key={'header'}>
        <th>Kysymys</th>
        {!this.state.byCourse && <th>Course</th>}
        <th>Week</th>
        <th>Flags</th>
        <th>Most recent flag</th>
        <th></th>
      </tr>
    )
    array.forEach((item, index) => {
      let children = []
      children.push(<td key={item.item.value}>{item.kind === 'PrintQuestion' ? item.item.value : 'Mikä kääntyy?'}</td>)
      !this.state.byCourse && children.push(<td key={item.course}>{item.course}</td>)
      children.push(<td key={item.group}>{item.group}</td>)
      children.push(<td key={item.flags}>{item.flags}</td>)
      children.push(<td key={item.recentFlag}>{item.recentFlag}</td>)
      children.push(
        <td key={item.item}>
          <Button size='small' variant='outlined' aria-label='Delete' onClick={() => this.toggleShowQuestion(item)}>
              Show
          </Button>
        </td>
      )
      table.push(<tr key={index}>{children}</tr>)
    })
    return table
  }

  render () {
    let { flaggedQuestions, history } = this.props
    const words = history.location.pathname.split('/')
    const course = words[words.length - 1]
    const title = this.state.byCourse ? `Kurssin ${course} ilmiannetut kysymykset` : 'Jotain muuta'
    return (
      <div>
        <div className='recentlyFlagged'>
          <h3>{title}</h3>
          <table>
            <tbody>
              {this.renderTable(flaggedQuestions)}
            </tbody>
          </table>
        </div>
        {this.state.showQuestion && (
          <Popup toggle={() => this.toggleShowQuestion(null)}>
            <AlertWindow neutral width={'100%'}>
              <DumbQuestion question={this.state.showQuestion} />
            </AlertWindow>
          </Popup>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    flaggedQuestions: state.question.flaggedQuestions
  }
}

export default connect(mapStateToProps)(FlaggedQuestionsTable)