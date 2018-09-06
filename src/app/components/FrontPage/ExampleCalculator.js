import React from 'react'
import Button from '../common/Button'
import { increment } from '../../utils/calculator'

class ExampleCalculator extends React.Component {
  handleIncrementClick = () => this.props.handleClick(increment(this.props.currentValue))

  render() {
    const { currentValue } = this.props
    return (
      <div className='calculator-container'>
        <p className='current-value'>Current value: { currentValue }</p>
        <Button handleClick={ this.handleIncrementClick } value='Increment!' />
      </div>
    )
  }
}

export default ExampleCalculator
