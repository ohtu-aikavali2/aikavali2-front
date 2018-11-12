import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

class PathBar extends Component {

  render () {
    const { paths } = this.props
    return (
      <div style={{ margin: 0, padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
          {paths.map((p) => (
            <Button key={p} style={{ marginLeft: 2, marginRight: 2 }} size='small' variant='outlined' aria-label='Delete' onClick={() => this.props.onClick(p)}>
              {p}
            </Button>
          ))}
        </div>
      </div>
    )
  }
}

export default PathBar
