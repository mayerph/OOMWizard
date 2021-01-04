import React from 'react'
import ReactDOM from 'react-dom'
import TextControl from './TextControl'

it('It should mount', () => {
  const div = document.createElement('div')
  ReactDOM.render(<TextControl />, div)
  ReactDOM.unmountComponentAtNode(div)
})
