import React, { Component } from 'react'
import ExampleCalculator from './ExampleCalculator'
import { connect } from 'react-redux'
import { exampleIncrement } from '../../reducers/actions/exampleActions'
import './frontPage.css'

class FrontPage extends Component {
  render () {
    return (
      <div>
        <ExampleCalculator currentValue={this.props.example.currentValue} handleClick={this.props.exampleIncrement} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    example: state.example
  }
}

const ConnectedFrontPage = connect(
  mapStateToProps,
  { exampleIncrement }
)(FrontPage)

export default ConnectedFrontPage
