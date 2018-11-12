import React, { Component } from 'react'
import ClickBox from '../common/ClickBox'
import PathBar from '../common/PathBar'

export class AdminPage extends Component {

  redirect = (path) => {
    const location = this.props.history.location.pathname
    // Only if not already there
    if (path !== location && path !== `${location}/`) {
      this.props.history.push(path)
    }
  }
  pathIntoArray = () => {
    let paths = [ 'home' ]
    const words = this.props.history.location.pathname.split('/')
    // First one is "", second one is admin
    for (let i = 1; i < words.length; i++) {
      paths.push(words[i])
    }
    return paths
  }
  pathBarRedirect = (pathName) => {
    if (pathName === 'home') {
      this.redirect('/')
    } else if (pathName === 'admin') {
      this.redirect('/admin')
    } else if (pathName === 'flags') {
      this.redirect('/admin/flags')
    } else if (pathName === 'newquestion') {
      this.redirect('/admin/newquestion')
    } else if (pathName === 'courses') {
      this.redirect('/admin/flags/courses')
    } else {
      // Nothing of the above, has to be a course name
      this.redirect(`/admin/flags/courses/${pathName}`)
    }
  }
  render () {
    const path = this.props.history.location.pathname
    return (
      <div className='adminPageContainer'>
        <p style={{ marginBottom: 10, marginTop: 10, fontSize: 30, fontWeight: 'bold' }}>Admin page</p>
        <PathBar paths={this.pathIntoArray()} onClick={this.pathBarRedirect} />
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
