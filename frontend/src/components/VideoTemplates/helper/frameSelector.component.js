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
import '../videoTemplates.style.css'

const FrameSelector = (props) => {
  const { frames, callback } = props
  const maxLength = frames.length ? frames.length : _.values(frames).length

  const valuetext = (value) => {
    return `${value + 1}`
  }

  const handleChange = (event, newValue) => {
    callback(newValue)
  }

  return (
    <div className="root-elm">
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="continuous-slider"
        step={1}
        min={0}
        max={maxLength - 1}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => value + 1}
      />
    </div>
  )
}

export default FrameSelector
