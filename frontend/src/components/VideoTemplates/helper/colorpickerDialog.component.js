import Typography from '@material-ui/core/Typography'
import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'

import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import PersonIcon from '@material-ui/icons/Person'
import AddIcon from '@material-ui/icons/Add'

import { blue } from '@material-ui/core/colors'

import { HuePicker, SketchPicker, ChromePicker } from 'react-color'

const ColorPickerDialog = (props) => {
  const { open, defaultColor, handleClose, handleOk } = props
  let choosenColor = defaultColor
  const clickHandler = () => {
    console.log('clicked ok')
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
      <ChromePicker
        disableAlpha="true"
        onChange={changeHandler}
        color={defaultColor}
      />
      <Button onClick={clickHandler}>Ok</Button>
    </Dialog>
  )
}

export default ColorPickerDialog
