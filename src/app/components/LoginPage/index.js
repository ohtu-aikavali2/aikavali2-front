import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import './loginPage.css'
import { login } from '../../reducers/actions/authActions'

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      error: false
    }
  }

  handleLogin = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    this.props.login(username, password)
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.loggingIn && !nextProps.loggingIn) {
      this.setState({ password: '', error: true })
    }
  }

  handleChange = (e) => {
    const newState = { error: false }
    newState[e.target.name] = e.target.value
    this.setState({ ...newState })
  }

  render() {
    const { loggingIn, error } = this.props
    return (
      <div className='login-page'>
        <Card className='login-form-container'>
          <CardHeader title='TMC-kirjautuminen' />
          <form onSubmit={this.handleLogin}>
            <CardContent>
              <TextField
                autoFocus
                name='username'
                id='username'
                label='Käyttäjätunnus'
                type='text'
                fullWidth
                value={this.state.username}
                onChange={this.handleChange}
              />
              <TextField
                margin='normal'
                name='password'
                id='password'
                label='Salasana'
                type='password'
                fullWidth
                value={this.state.password}
                onChange={this.handleChange}
                error={this.state.error}
              />
              {error.length > 0 && this.state.error && <span className='error'>{error}</span>}
            </CardContent>
            <CardActions>
              <Button type='submit' disabled={loggingIn || this.state.username.length === 0} color='primary'>
                {!loggingIn && 'Kirjaudu sisään'}
                {loggingIn && 'Kirjaudutaan...'}
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.loggedUser.loggedUser,
    loggingIn: state.loggedUser.loggingIn,
    error: state.loggedUser.error
  }
}

export default connect(
  mapStateToProps,
  { login }
)(LoginPage)
