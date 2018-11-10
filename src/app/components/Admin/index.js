import React, { Component } from 'react'

export class AdminPage extends Component {

  redirect = (path) => {
    this.props.history.push(path)
  }
  render () {
    const path = this.props.history.location.pathname
    return (
      <div className='adminPageContainer'>
        <h1>Admin page</h1>
        {(path === '/admin' || path === '/admin/') && (
          <div>
            <div onClick={() => this.redirect('/admin/addquestion')}>
              <p>Add a question</p>
            </div>
            <div onClick={() => this.redirect('/admin/flags')}>
              <p>Flagged questions</p>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default AdminPage
