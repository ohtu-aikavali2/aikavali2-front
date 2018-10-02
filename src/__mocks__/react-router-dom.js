import React from 'react'
const rrd = require('react-router-dom')

// eslint-disable-next-line
rrd.BrowserRouter = ({children}) => <div>{children}</div>
// eslint-disable-next-line
module.exports = rrd
