import React, { Component } from 'react'
import Course from './Course'
import './coursePage.css'

const courses = [
  {
    title: 'Ohjelmoinnin perusteet'
  },
  {
    title: 'Ohjelmoinnin jatkokurssi'
  },
  {
    title: 'Tietokantojen perusteet'
  },
  {
    title: 'Tietorakenteet ja algoritmit'
  }
]

export class CoursePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div className='course-page'>
        {courses.map(course => (
          <Course key={course.title} title={course.title} />
        ))}
      </div>
    )
  }
}

export default CoursePage
