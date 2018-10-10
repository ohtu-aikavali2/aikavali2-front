import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'
import ButtonBar from '../common/ButtonBar'
import { connect } from 'react-redux'
import { getRandomQuestion, answerQuestion } from '../../reducers/actions/questionActions'

export class Question extends Component {
  constructor () {
    super()
    this.state = {
      selected: null
    }
  }

  getNewQuestion = async () => {
    await this.props.getRandomQuestion()
    // setState() after async function, so that new question is
    // rendered (almost) at the same time that option selections are removed
    this.setState({ selected: null })
  }

  handleConfirm = async () => {
    const { selected } = this.state
    if (selected) {
      // Muodossa { id, value }
      await this.props.answerQuestion(selected.id, selected.value)
    }
  }

  renderUserAnswer = (userAnswer) => {
    const { isCorrect, correctAnswer } = userAnswer
    const style = { display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }
    const message = isCorrect ? 'Correct!' : `Wrong! Correct answer is '${correctAnswer}'`
    return (
      <div style={style}>
        {message}
      </div>
    )
  }

  selectOption = (id, value) => {
    this.setState({ selected: { id, value } })
  }

  render() {
    const { question, userAnswer } = this.props
    return (
      <div className='questionContainer'>
        {userAnswer && this.renderUserAnswer(userAnswer)}
        {question && question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} handleSelect={this.selectOption} handleConfirm={this.handleConfirm} selected={this.state.selected} />}
        {question && question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} handleSelect={this.selectOption} handleConfirm={this.handleConfirm} selected={this.state.selected} />}
        <ButtonBar handleSkip={this.getNewQuestion} showNext={userAnswer} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer,
    question: state.question.question
  }
}
const mapDispatchToProps = {
  getRandomQuestion,
  answerQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
