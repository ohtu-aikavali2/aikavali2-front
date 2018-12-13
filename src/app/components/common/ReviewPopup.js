import React from 'react'
import AlertWindow from '../common/AlertWindow'
import '../Question/question.css'
import LikertScale from 'likert-react'
import Popup from './Popup'

export const ReviewPopup = ({ toggle, submit, checked, timeout }) => {
  return (
    <Popup className='popupContainer' toggle={toggle} checked={checked} timeout={timeout}>
      <AlertWindow neutral>
        <div className='likertScale'>
          <LikertScale reviews={['']} onClick={submit} />
        </div>
      </AlertWindow>
    </Popup>
  )
}

export default ReviewPopup
