import React from 'react'
import { useSelector } from 'react-redux'

export const Test = ({ match }) => {
  const { postId } = match.params

  return <div>test</div>
}
