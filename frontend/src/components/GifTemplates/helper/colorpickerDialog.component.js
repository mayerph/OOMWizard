import React from 'react'

import Button from '@material-ui/core/Button'

import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

import { ChromePicker } from 'react-color'

const ColorPickerDialog = (props) => {
  const { open, defaultColor, handleClose, handleOk } = props
  let choosenColor = defaultColor
  const clickHandler = () => {
    handleOk(choosenColor)
  }
  const changeHandler = (color, event) => {
    choosenColor = color.hex
  }
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Choose color</DialogTitle>
      <ChromePicker onChange={changeHandler} color={defaultColor} />
      <Button onClick={clickHandler}>Ok</Button>
    </Dialog>
  )
}

export default ColorPickerDialog
