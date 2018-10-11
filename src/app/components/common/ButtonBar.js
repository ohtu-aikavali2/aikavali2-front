import React from 'react'
import Button from '@material-ui/core/Button'
import SkipNext from '@material-ui/icons/SkipNext'
import Confirm from '@material-ui/icons/Check'
import './common.css'

export function ButtonBar({ handleSkip, showNext, noMoreQuestions }) {
  return (
    <div className='buttonBarContainer'>
      <div className='skip'>
        <Button disabled={showNext || noMoreQuestions} onClick={handleSkip} variant="contained" color="secondary" className='skipButton'>
          Skip
          <SkipNext className='skipIcon' />
        </Button>
      </div>
      <div className='next'>
        <Button disabled={!showNext || noMoreQuestions} onClick={handleSkip} variant="contained" color="primary" className='nextButton'>
          Next
          <Confirm className='confirmIcon' />
        </Button>
      </div>
    </div>
  )
}

export default ButtonBar
