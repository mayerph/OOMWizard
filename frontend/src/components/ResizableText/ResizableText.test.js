import React from 'react'
import ReactDOM from 'react-dom'
import ResizableText from './ResizableText'

it('It should mount', () => {
  const div = document.createElement('div')
  ReactDOM.render(<ResizableText />, div)
  ReactDOM.unmountComponentAtNode(div)
})
