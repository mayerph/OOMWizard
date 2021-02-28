import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'fontsource-roboto'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

/* test('renders learn react link', () => {
  ReactDOM.render(<MainApp />, div)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
}) */

it('loads meme editor', () => {
  const { getByText } = render(<App />)
  fireEvent.click(getByText('Meme Editor'))
  const results = document.getElementById('meme-canvas-card')
  expect(results).toBeDefined()
})

it('can move to add image template', () => {
  const { getByText } = render(<App />)
  const results = document.getElementsByClassName(
    'MuiButtonBase-root MuiTab-root MuiTab-textColorInherit Mui-selected MuiTab-labelIcon',
  )
  expect(results.getAttribute('tabindex').toBe('0'))
  fireEvent.click(getByText('Add Image Template'))
  expect(results.getAttribute('tabindex').toBe('-1'))
})

it('renders without crashing', () => {
  const store = createStore(rootReducer, applyMiddleware(thunk))
  const d = document.createElement('div')
  ReactDOM.render(<App />, d)
  ReactDOM.unmountComponentAtNode(d)
})
