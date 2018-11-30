import React from 'react'

const FeedbackBar = ({ topLeftContent, topRightContent }) => {
  return (
    <div style={{ width: '100%', height: 30, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {topLeftContent}
      </div>
      <div style={{ flex: 0.5 }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        {topRightContent}
      </div>
    </div>
  )
}

export default FeedbackBar
