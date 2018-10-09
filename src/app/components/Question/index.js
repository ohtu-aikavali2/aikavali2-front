import React, { Component } from 'react'
import PrintQuestion from './PrintQuestion'
import CompileQuestion from './CompileQuestion'
import ButtonBar from '../common/ButtonBar'
import { connect } from 'react-redux'
import { getRandomQuestion, answerQuestion } from '../../reducers/actions/questionActions'

export class Question extends Component {

  getNewQuestion = () => {
    this.props.getRandomQuestion()
  }

  handleConfirm = async () => {
    const selected = this.props.selectedAnswer
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

  render() {
    const { question, userAnswer } = this.props
    return (
      <div className='questionContainer'>
        {userAnswer && this.renderUserAnswer(userAnswer)}
        {question && question.kind === 'PrintQuestion' && <PrintQuestion question={question.item} />}
        {question && question.kind === 'CompileQuestion' && <CompileQuestion question={question.item} />}
        <ButtonBar handleSkip={this.getNewQuestion} handleConfirm={this.handleConfirm} showNext={userAnswer} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userAnswer: state.question.userAnswer,
    selectedAnswer: state.question.selectedAnswer,
    question: state.question.question
  }
}
const mapDispatchToProps = {
  getRandomQuestion,
  answerQuestion
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
