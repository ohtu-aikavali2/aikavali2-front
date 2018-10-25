import React from 'react'
import AlertWindow from '../common/AlertWindow'
import '../Question/question.css'
import LikertScale from 'likert-react'

const ReviewPopup = ({ toggle, submit }) => {
  return (
    <div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', background: 'rgb(0, 0, 255, 0.2)', zIndex: 1 }} onClick={toggle} />
      <div style={{ position: 'fixed', height: 150, width: '100%', top: '40%', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
        <AlertWindow neutral>
          <div className='likertScale'>
            <LikertScale reviews={['']} onClick={submit} />
          </div>
        </AlertWindow>
      </div>
    </div>
  )
}

export default ReviewPopup
