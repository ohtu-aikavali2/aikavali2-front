import React, { Component } from 'react'
import ClickBox from '../common/ClickBox'

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
            <ClickBox title={'Lisää uusi kysymys'} onClick={() => this.redirect('/admin/newquestion')} />
            <ClickBox title={'Ilmiannetut kysymykset'} onClick={() => this.redirect('/admin/flags')} />
          </div>
        )}
      </div>
    )
  }
}

export default AdminPage
