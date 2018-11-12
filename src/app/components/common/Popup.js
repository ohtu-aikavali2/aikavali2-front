import React from 'react'

const Popup = ({ toggle, children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, background: 'rgb(0, 0, 255, 0.2)', zIndex: 2 }} onClick={toggle}>
      {children}
    </div>
  )
}

export default Popup
