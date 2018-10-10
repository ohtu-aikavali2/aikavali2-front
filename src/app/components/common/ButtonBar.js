import React from 'react'
import Button from '@material-ui/core/Button'
import SkipNext from '@material-ui/icons/SkipNext'
import './common.css'

export function ButtonBar ({ handleSkip, showNext }) {
  const text = showNext ? 'Next' : 'Skip'
  return (
    <div className={`buttonBarContainer ${showNext ? 'next' : 'skip'}`}>
      <Button onClick={handleSkip} variant="contained" color="secondary" className='skipButton'>
        {text}
        <SkipNext className='skipIcon' />
      </Button>
    </div>
  )
}

export default ButtonBar
