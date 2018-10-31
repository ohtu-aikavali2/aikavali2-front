import React from 'react'
import AlertWindow from '../common/AlertWindow'
import '../Question/question.css'
import LikertScale from 'likert-react'

export const ReviewPopup = ({ toggle, submit }) => {
  return (
    <div className='popupContainer' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, background: 'rgb(0, 0, 255, 0.2)', zIndex: 2 }} onClick={toggle}>
      <AlertWindow neutral>
        <div className='likertScale'>
          <LikertScale reviews={['']} onClick={submit} />
        </div>
      </AlertWindow>
    </div>
  )
}

export default ReviewPopup
