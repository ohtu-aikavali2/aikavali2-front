import React, { Component } from 'react'
import QuestionForm from './QuestionForm'

export class AdminPage extends Component {

  render () {
    return (
      <div className='adminPageContainer'>
        <h1>Admin page</h1>
        <QuestionForm />
      </div>
    )
  }
}

export default AdminPage
