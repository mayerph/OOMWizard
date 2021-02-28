import Typography from '@material-ui/core/Typography'
import React from 'react'

import Slider from '@material-ui/core/Slider'
import * as _ from 'lodash'

const RangeSlider = (props) => {
  const { frames, callback, config, index } = props
  const maxLength = frames.length ? frames.length : _.values(frames).length

  const [value, setValue] = React.useState(config)

  const valuetext = (value) => {
    return `${value + 1}`
  }

  const handleChange = (event, newV) => {
    const newValue = newV == null ? maxLength - 1 : newV
    setValue(newValue)
    callback({ old: value, new: newValue })
  }

  return (
    <div key={index}>
      <Typography component={'span'} id="range-slider" gutterBottom>
        Select Frames
      </Typography>
      <Slider
        value={value}
        getAriaValueText={valuetext}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        max={maxLength - 1}
        step={1}
        valueLabelFormat={(value) => value + 1}
      />
    </div>
  )
}

export default RangeSlider
