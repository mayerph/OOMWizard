import Typography from '@material-ui/core/Typography'
import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'
import Slider from '@material-ui/core/Slider'
const RangeSlider = (props) => {
  const { frames, callback, config } = props

  const [value, setValue] = React.useState(config)

  const valuetext = (value) => {
    return `${value + 1}`
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
    callback({ old: value, new: newValue })
  }

  return (
    <div>
      <Typography id="range-slider" gutterBottom>
        Select Frames
      </Typography>
      <Slider
        value={value}
        getAriaValueText={valuetext}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        max={frames - 1}
        step={1}
        valueLabelFormat={(value) => value + 1}
      />
    </div>
  )
}

export default RangeSlider
