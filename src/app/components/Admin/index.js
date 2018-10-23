import React, { Component } from 'react'
import ConnectedQuestionForm from './QuestionForm'

export class AdminPage extends Component {

  render () {
    return (
      <div className='adminPageContainer'>
        <h1>Admin page</h1>
        <ConnectedQuestionForm />
      </div>
    )
  }
}

export default AdminPage
