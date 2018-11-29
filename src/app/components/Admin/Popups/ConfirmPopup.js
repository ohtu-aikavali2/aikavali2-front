import React from 'react'
import Popup from '../../common/Popup'
import AlertWindow from '../../common/AlertWindow'
import Button from '@material-ui/core/Button'

const ConfirmPopup = ({ title, description1, description2, okClick, okText, toggle }) => {
  return (
    <Popup toggle={toggle}>
      <AlertWindow title={title}>
        <div style={{ marginTop: 20 }}>
          <p>{description1}</p>
          <p style={{ marginTop: 20, fontSize: 12 }}>{description2}</p>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Button onClick={okClick}>
              {okText}
            </Button>
            <Button onClick={toggle}>
              Peruuta
            </Button>
          </div>
        </div>
      </AlertWindow>
    </Popup>
  )
}

export default ConfirmPopup
