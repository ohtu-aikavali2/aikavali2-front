import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import AlertWindow from '../common/AlertWindow'
import DumbQuestion from '../Question/DumbQuestion'
import { getAllFlaggedQuestions } from '../../reducers/actions/questionActions'

const rows = [
  { id: 'value', numeric: false, disablePadding: true, label: 'Kysymys' },
  { id: 'course', numeric: false, disablePadding: false, label: 'Kurssi' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Viikko' },
  { id: 'flags', numeric: true, disablePadding: false, label: 'Ilmiantoja' },
  { id: 'recentFlag', numeric: true, disablePadding: false, label: 'Viimeisin ilmianto' }
]

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function sortByQuestion(a, b) {
  const valueA = a.kind === 'PrintQuestion' ? a.item.value : 'Mikä kääntyy?'
  const valueB = b.kind === 'PrintQuestion' ? b.item.value : 'Mikä kääntyy?'
  if (valueB < valueA) {
    return -1
  }
  if (valueB > valueA) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  // Tämä palauttaa siis sort-funktion
  if (orderBy === 'value') {
    // sortByQuestion, koska value on item-objektin sisällä
    return order === 'desc' ? (a, b) => sortByQuestion(a, b) : (a, b) => -sortByQuestion(a, b)
  }
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

let counter = 0
function createData(object) {
  counter += 1
  return { ...object, id: counter }
}
class FlaggedQuestionsTable extends Component {
  constructor () {
    super()
    this.state = {
      order: 'asc',
      orderBy: 'total flags',
      selected: [],
      data: [],
      expanded: false,
      showFilterInput: false,
      filterValue: ''
    }
  }
  // This is needed. For example, if u press "previous" on browser, and then "next", the state would be empty
  static getDerivedStateFromProps = (props, state) => {
    if (props.flaggedQuestions.length !== state.data.length) {
      return {
        data: props.flaggedQuestions.map(f => createData(f))
      }
    }
    return null
  }

  async componentDidMount () {
    await this.props.getAllFlaggedQuestions()
  }
  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  }
  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }
  isSelected = id => this.state.selected.indexOf(id) !== -1

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    this.setState({ selected: newSelected })
  }
  handleExpand = (id) => {
    this.setState({ expanded: this.state.expanded === id ? false : id })
  }
  onFilterClick = () => {
    this.setState({ showFilterInput: !this.state.showFilterInput })
  }
  onFilterChange = (event) => {
    this.setState({ filterValue: event.target.value })
  }
  handleFiltering = () => {
    if (this.state.filterValue === '') {
      return this.state.data
    }
    let newData = []
    this.state.data.forEach(d => {
      if (this.asString(d).indexOf(this.state.filterValue.toLowerCase()) !== -1) {
        newData.push(d)
      }
    })
    return newData
  }
  asString = (d) => {
    let string = `${d.course} ${d.group} ${d.flags} ${d.recentFlag} ${d.item.value}`
    return string.toLowerCase()
  }

  render () {
    let { data } = this.state
    const { order, orderBy, selected, filterValue } = this.state
    data = this.handleFiltering()
    return (
      <Paper style={{ width: '96%', margin: '2%' }}>
        <TableToolbar numSelected={selected.length} onFilterClick={this.onFilterClick} showFilterInput={this.state.showFilterInput} filterValue={filterValue} onFilterChange={this.onFilterChange} />
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ minWidth: 350 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy)).map(n => {
                const isSelected = this.isSelected(n.id)
                return (
                  <React.Fragment key={n.item._id}>
                    <TableRow
                      hover
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                      style={{ width: '100%' }}
                    >
                      <TableCell
                        padding='checkbox'
                        onClick={event => this.handleClick(event, n.id)}
                      >
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component='th' scope='row' padding='none' onClick={() => this.handleExpand(n.id)}>
                        {n.kind === 'PrintQuestion' ? n.item.value : 'Mikä kääntyy?'}
                      </TableCell>
                      <TableCell onClick={() => this.handleExpand(n.id)}>{n.course}</TableCell>
                      <TableCell onClick={() => this.handleExpand(n.id)} style={{ verticalAlign: 'top', height: 'auto', paddingTop: '1.4em' }}>{n.group}</TableCell>
                      <TableCell onClick={() => this.handleExpand(n.id)} numeric>{n.flags}</TableCell>
                      <TableCell onClick={() => this.handleExpand(n.id)} numeric>{n.recentFlag}</TableCell>
                    </TableRow>
                    <TableRow
                      key={n}
                      style={{ height: this.state.expanded === n.id ? null : 0 }}
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      aria-checked={isSelected}
                      selected={isSelected}
                    >
                      <TableCell colSpan={6} padding='none'>
                        <ExpansionPanel style={{ background: 'transparent' }} expanded={this.state.expanded === n.id} onChange={() => this.handleExpand(n.id)}>
                          <ExpansionPanelDetails>
                            <AlertWindow neutral>
                              <DumbQuestion question={n} />
                            </AlertWindow>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}
class EnhancedTableHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }
  render () {
    const { onSelectAllClick, numSelected, order, orderBy, rowCount } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title='Sort'
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
    )
  }
}

const TableToolbar = (props) => {
  const { numSelected } = props

  return (
    <Toolbar
      style={{
        color: numSelected > 0 ? 'red' : 'black',
        background: numSelected > 0 ? 'rgba(255, 0, 0, 0.2)' : 'white',
        display: 'flex'
      }}
    >
      <div style={{ flex: 0.9 }}>
        {numSelected > 0 ? (
          <Typography color="inherit" style={{ fontSize: 16 }}>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography id="tableTitle" style={{ fontSize: 20 }}>
            Ilmiannetut kysymykset
          </Typography>
        )}
      </div>
      <div style={{ flex: 0.1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }} >
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div style={{ flexDirection: 'row', display: 'flex' }}>
            {props.showFilterInput && (
              <input
                style={{ width: 200, borderColor: 'grey', borderWidth: 1, borderRadius: 5, padding: 10, fontSize: 14 }}
                placeholder='Etsi kysymyksiä'
                onChange={props.onFilterChange}
                value={props.filterValue}
              />
            )}
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list" onClick={props.onFilterClick}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </Toolbar>
  )
}

const mapStateToProps = (state) => {
  return {
    flaggedQuestions: state.question.flaggedQuestions
  }
}
const mapDispatchToProps = {
  getAllFlaggedQuestions
}

export default connect(mapStateToProps, mapDispatchToProps)(FlaggedQuestionsTable)
