import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'

const Loading = ({ bar, ...rest }) => {
  return (
    <div {...rest}>
      {!bar && <CircularProgress />}
      {bar && <LinearProgress />}
    </div>
  )
}

export default Loading
