import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllFlaggedQuestions } from '../../reducers/actions/questionActions'
import ClickBox from '../common/ClickBox'

class FlaggedQuestions extends Component {
  constructor() {
    super()
    this.state = {
      renderMainView: true
    }
  }

  /*componentDidMount() {
    this.props.getAllFlaggedQuestions()
  }*/
  renderTable = (array) => {
    let table = []
    table.push(
      <tr key={'header'}>
        <th>Course</th>
        <th>Week</th>
        <th>Question</th>
        <th>Flags</th>
        <th>Most recent flag</th>
      </tr>
    )
    array.forEach((item, index) => {
      let children = []
      children.push(<td key={item.course}>{item.course}</td>)
      children.push(<td key={item.group}>{item.group}</td>)
      children.push(<td key={item.kind}>{item.kind === 'PrintQuestion' ? item.item.value : 'Mikä kääntyy?'}</td>)
      children.push(<td key={item.flags}>{item.flags}</td>)
      children.push(<td key={item.recentFlag}>{item.recentFlag}</td>)
      table.push(<tr key={index}>{children}</tr>)
    })
    return table
  }
  getFlaggedQuestions = (type) => {
    if (type === 'all') {
      this.props.getAllFlaggedQuestions()
    } else if (type === 'course') {
      // Renderöidään kurssinäkymä ja odotetaan mikä kurssi painetaan
      console.log('Kurssi näkymän toteutusta odotellaan')
    }
  }
  render () {
    let questions = this.props.allFlaggedQuestions
    return (
      <div style={{ marginTop: 0 }} className='flaggedQuestionsContainer'>
        {this.state.renderMainView && (
          <div>
            <ClickBox title={'Kaikki ilmiannetut kysymykset'} onClick={() => this.getFlaggedQuestions('all')} />
            <ClickBox title={'Ilmiannetut kysymykset kursseittain'} onClick={() => this.getFlaggedQuestions('course')} />
          </div>
        )}
        {questions.length !== 0 && (
          <div className='recentlyFlagged'>
            <h3>Kaikki ilmiannetut kysymykset</h3>
            <table>
              <tbody>
                {this.renderTable(questions)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allFlaggedQuestions: state.question.flaggedQuestions
  }
}
const mapDispatchToProps = {
  getAllFlaggedQuestions
}
export default connect(mapStateToProps, mapDispatchToProps)(FlaggedQuestions)
