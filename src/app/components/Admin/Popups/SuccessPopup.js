import React from 'react'
import Popup from '../../common/Popup'
import AlertWindow from '../../common/AlertWindow'
import Button from '@material-ui/core/Button'

const SuccessPopup = ({ title, toggle }) => {
  return (
    <Popup toggle={toggle}>
      <AlertWindow title={title}>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button onClick={toggle}>
              Ok
            </Button>
          </div>
        </div>
      </AlertWindow>
    </Popup>
  )
}

export default SuccessPopup
