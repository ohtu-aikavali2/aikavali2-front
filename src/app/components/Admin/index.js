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
    let paths = [ 'Etusivu' ]
    const words = this.props.history.location.pathname.split('/')
    // First one is "", second one is admin
    for (let i = 1; i < words.length; i++) {
      // Name the paths as u like, remember to also change them to pathBarRedirect
      if (words[i] === 'flags') {
        paths.push('Ilmiannetut')
      } else if (words[i] === 'newquestion') {
        paths.push('Lisää kysymys')
      } else if (words[i] === 'deleted') {
        paths.push('Poistetut')
      } else if (words[i] === 'questions') {
        paths.push('Kaikki kysymykset')
      } else {
        paths.push(words[i])
      }
    }
    return paths
  }
  pathBarRedirect = (pathName) => {
    if (pathName === 'Etusivu') {
      this.redirect('/')
    } else if (pathName === 'admin') {
      this.redirect('/admin')
    } else if (pathName === 'Ilmiannetut') {
      this.redirect('/admin/flags')
    } else if (pathName === 'Lisää kysymys') {
      this.redirect('/admin/newquestion')
    } else if (pathName === 'Poistetut') {
      this.redirect('/admin/deleted')
    } else if (pathName === 'Kaikki kysymykset') {
      this.redirect('/admin/questions')
    } else {
      this.redirect('/')
    }
  }
  render () {
    const path = this.props.history.location.pathname
    return (
      <div className='adminPageContainer'>
        <p style={{ marginBottom: 20, marginTop: 20, fontSize: 30, fontWeight: 'bold' }}>Ylläpitäjän toiminnot</p>
        <PathBar paths={this.pathIntoArray()} onClick={this.pathBarRedirect} />
        {(path === '/admin' || path === '/admin/') && (
          <div>
            <ClickBox title={'Lisää uusi kysymys'} onClick={() => this.redirect('/admin/newquestion')} />
            <ClickBox title={'Ilmiannetut kysymykset'} onClick={() => this.redirect('/admin/flags')} />
            <ClickBox title={'Poistetut kysymykset'} onClick={() => this.redirect('/admin/deleted')} />
            <ClickBox title={'Käytössä olevat kysymykset'} onClick={() => this.redirect('/admin/questions')} />
          </div>
        )}
      </div>
    )
  }
}

export default AdminPage
