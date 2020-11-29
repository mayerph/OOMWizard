import React from 'react';
import ReactDOM from 'react-dom';
import ResizableImage from './ResizableImage';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ResizableImage />, div);
  ReactDOM.unmountComponentAtNode(div);
});