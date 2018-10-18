import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ render: Component, pred, redirectTo, children, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      pred
        ? (Component && <Component {...props} />) || children
        : (
          <Redirect to={{
            pathname: redirectTo,
            state: { from: props.location }
          }} />
        )
    )} />
  )
}

ProtectedRoute.propTypes = {
  render: PropTypes.func,
  pred: PropTypes.bool,
  redirectTo: PropTypes.string
}

export default ProtectedRoute
