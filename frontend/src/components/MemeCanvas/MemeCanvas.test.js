import React from 'react'
import ReactDOM from 'react-dom'
import MemeCanvas from './MemeCanvas'

it('It should mount', () => {
  const div = document.createElement('div')
  ReactDOM.render(<MemeCanvas />, div)
  ReactDOM.unmountComponentAtNode(div)
})
