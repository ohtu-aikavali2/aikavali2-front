import React, { Component } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FilterListIcon from '@material-ui/icons/FilterList'
import Button from '@material-ui/core/Button'
import '../../Admin/admin.css'

class TableToolbar extends Component {
  render () {
    const { numSelected, title, toolbarButton1Text, toolbarButton2Text, toolbarButton1Tooltip, toolbarButton2Tooltip } = this.props
    return (
      <Toolbar
        style={{
          color: numSelected > 0 ? 'red' : 'black',
          background: numSelected > 0 ? 'rgba(255, 0, 0, 0.2)' : 'white',
          display: 'flex'
        }}
      >
        <div style={{ flex: 0.4 }}>
          {numSelected > 0 ? (
            <Typography color="inherit" style={{ fontSize: 16 }}>
              {numSelected} selected
            </Typography>
          ) : (
            <Typography id="tableTitle" style={{ fontSize: 20 }}>
              {title}
            </Typography>
          )}
        </div>
        <div style={{ flex: 0.3, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', cursor: 'pointer' }}>
          {numSelected > 0 && toolbarButton1Text && (
            <Tooltip title={toolbarButton1Tooltip}>
              <Button color="primary" style={{ fontSize: 14 }} onClick={this.props.handleButton1Click}>{toolbarButton1Text}</Button>
            </Tooltip>
          )}
        </div>
        <div style={{ flex: 0.3, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', cursor: 'pointer' }} >
          {(numSelected > 0 && toolbarButton2Text) ? (
            <Tooltip title={toolbarButton2Tooltip}>
              <Button color="secondary" style={{ fontSize: 14 }} onClick={this.props.handleButton2Click}>{toolbarButton2Text}</Button>
            </Tooltip>
          ) : (
            <div style={{ flexDirection: 'row', display: 'flex', position: 'absolute', zIndex: 1, top: 5 }}>
              <input
                className={this.props.showFilterInput ? 'filterFieldShow' : 'filterFieldHide'}
                placeholder='Etsi kysymyksiä'
                onChange={this.props.onFilterChange}
                value={this.props.filterValue}
              />
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list" onClick={this.props.onFilterClick}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Toolbar>
    )
  }
}

export default TableToolbar
