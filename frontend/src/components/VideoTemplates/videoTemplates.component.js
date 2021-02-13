import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'
import { connect } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import './videoTemplates.style.css'
import { MemeCanvas } from '../MemeCanvas'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import CloseButton from '@material-ui/icons/Close'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'

function FrameSelector(props) {
  const { frames, callback } = props
  const valuetext = (value) => {
    return `${value + 1}`
  }
  const classes = useStyles()

  const handleChange = (event, newValue) => {
    callback(newValue)
  }

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Small steps
      </Typography>
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="continuous-slider"
        step={1}
        marks
        min={0}
        max={frames.length - 1}
        onChange={handleChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => value + 1}
      />
    </div>
  )
}

function RangeSlider(props) {
  const { frames, callback, config } = props

  const classes = useStyles()
  const [value, setValue] = React.useState(config)

  const valuetext = (value) => {
    return `${value + 1}`
  }

  const handleChange = (event, newValue) => {
    console.log('new value is', newValue)
    setValue(newValue)
    callback({ old: value, new: newValue })
  }

  return (
    <div className={classes.root}>
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
        marks
        valueLabelFormat={(value) => value + 1}
      />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
}))

const VideoTemplates = (props) => {
  const tileData = [
    {
      id: uuidv4(),
      text: 'hello world',
      x: 10,
      y: 50,
      frames: [1, 2],
    },
    {
      id: uuidv4(),
      text: 'hello universe',
      x: 20,
      y: 60,
      frames: [0, 2],
    },
    {
      id: uuidv4(),
      text: 'hello mars',
      x: 30,
      y: 70,
      frames: [0, 2],
    },
  ]

  const frames = [
    {
      id: uuidv4(),
      url:
        'https://nyc3.digitaloceanspaces.com/memecreator-cdn/media/__processed__/cd4/template-is-this-a-pigeon-0c6db91aec9c.jpg',
      captions: [],
    },
    {
      id: uuidv4(),
      url:
        'https://i0.wp.com/comicsandmemes.com/wp-content/uploads/blank-meme-template-115-rick-and-morty-wall-tear-open.jpg?fit=580%2C600&ssl=1',
      captions: [],
    },
    {
      id: uuidv4(),
      url:
        'https://nyc3.digitaloceanspaces.com/memecreator-cdn/media/__processed__/cd4/template-is-this-a-pigeon-0c6db91aec9c.jpg',
      captions: [],
    },
    {
      id: uuidv4(),
      url:
        'https://nyc3.digitaloceanspaces.com/memecreator-cdn/media/__processed__/cd4/template-is-this-a-pigeon-0c6db91aec9c.jpg',
      captions: [],
    },
    {
      id: uuidv4(),
      url:
        'https://nyc3.digitaloceanspaces.com/memecreator-cdn/media/__processed__/cd4/template-is-this-a-pigeon-0c6db91aec9c.jpg',
      captions: [],
    },
  ]

  const [drawing, setDrawing] = useState(false)
  const [captionList, setCaptionList] = useState(tileData)
  const [frameList, setFrameList] = useState(frames)
  const [stepSize, setStepSize] = useState(10)
  const [activeCaption, setActiveCaption] = useState(captionList[0])
  const [activeFrame, setActiveFrame] = useState(0)

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }))

  const baseImage = new Image()
  console.log('_------>', frameList[activeFrame].url)

  const drawImage = () => {
    baseImage.src = frameList[activeFrame].url
    const canvas = document.getElementById('meme')
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, baseImage.width, baseImage.height)

    context.canvas.width = baseImage.width
    context.canvas.height = baseImage.height
    context.drawImage(baseImage, 0, 0)
    frameList[activeFrame].captions.forEach((e) => {
      context.font = '30px Arial'
      context.fillText(e.text, e.x, e.y)
    })
    //setDrawing(!drawing)
  }

  const add = () => {
    captionList.push({
      id: uuidv4(),
      text: 'hello hello',
      x: 40,
      y: 80,
      frames: [0, 2],
    })
    setCaptionList([...captionList])

    drawImage()
  }

  const up = () => {
    setActiveCaption({ ...activeCaption, y: activeCaption.y - stepSize })
  }

  const down = () => {
    setActiveCaption({ ...activeCaption, y: activeCaption.y + stepSize })
  }

  const right = () => {
    setActiveCaption({ ...activeCaption, x: activeCaption.x + stepSize })
  }

  const left = () => {
    setActiveCaption({ ...activeCaption, x: activeCaption.x - stepSize })
  }

  useEffect(() => {
    initDrawing()
    drawImage()
  }, [])

  const setActive = (index) => {
    setActiveCaption(captionList[index])
  }

  const initDrawing = () => {
    for (var i = 0; i < captionList.length; i++) {
      for (
        let j = captionList[i].frames[0];
        j <= captionList[i].frames[1];
        j++
      ) {
        frameList[j].captions = _.uniqBy(
          [].concat(frameList[j].captions).concat(captionList[i]),
        )
      }
    }
    setFrameList(frameList)
    console.log('frameList', frameList)
    console.log('the active frame', frameList[activeFrame])
  }

  const updateCaptionsInFrames = (frames) => {
    if (frames.new != frames.old) {
      // delete items
      for (let i = frames.old[0]; i <= frames.old[1]; i++) {
        frameList[i].captions = frameList[i].captions.filter((item) => {
          if (item.id != activeCaption.id) {
            return item
          }
        })
      }
      // add items
      for (let i = frames.new[0]; i <= frames.new[1]; i++) {
        frameList[i].captions = _.uniqBy(
          [].concat(frameList[i].captions).concat(activeCaption),
          'id',
        )
      }

      setFrameList(frameList)
    }
  }

  const handleChange = (e, index) => {
    const { value } = e.target
    captionList[index].text = value
    const temp = [...captionList]
    setCaptionList(temp)
  }

  // update captionList
  // update captions in frameList (only for rendering)
  const redefineFrameRange = (e, index) => {
    captionList[index].frames = e.new
    updateCaptionsInFrames(e)
    setCaptionList([...captionList])
  }

  const deleteCaption = (index) => {
    console.log('delete')
    const newList = [...captionList]

    const t = newList.filter((e, i) => i !== index)

    setCaptionList(t)
  }

  const setVisibleFrame = (index) => {
    setActiveFrame(index)
  }

  useEffect(() => {
    console.log('activeFrame')
    drawImage()
  }, [activeFrame])

  useEffect(() => {
    drawImage()
  }, [captionList])

  useEffect(() => {
    const newList = captionList.map((item) => {
      if (item.id == activeCaption.id) {
        return activeCaption
      }
      return item
    })
    setCaptionList(newList)
  }, [activeCaption])

  const classes = useStyles()

  return (
    <div className="meme-generator-body">
      <div>
        <FrameSelector
          frames={frameList}
          callback={(e) => {
            setVisibleFrame(e)
          }}
        ></FrameSelector>
        <canvas id="meme"></canvas>
      </div>

      <div>
        <button onClick={add}>Add</button>
        <button
          onClick={() => {
            left()
          }}
        >
          Left
        </button>
        <button
          onClick={() => {
            right()
          }}
        >
          Right
        </button>
        <button
          onClick={() => {
            up()
          }}
        >
          Up
        </button>
        <button
          onClick={() => {
            down()
          }}
        >
          Down
        </button>
      </div>
      <div>
        {captionList.map((item, index) => (
          <>
            <Card
              className={`caption-card ${
                item.id == activeCaption.id ? 'active-item' : ''
              }`}
              key={item.id}
              onClick={(e) => {
                setActive(index)
              }}
            >
              <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <CloseButton
                      onClick={() => {
                        deleteCaption(index)
                      }}
                    />
                  </IconButton>
                }
                title={`Caption ${index + 1}`}
              />
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  <div>
                    <TextField
                      className="caption-input"
                      label="Caption"
                      defaultValue={captionList[index].text}
                      onChange={(e) => {
                        handleChange(e, index)
                      }}
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <RangeSlider
                      frames={frameList.length}
                      callback={(e) => {
                        redefineFrameRange(e, index)
                      }}
                      config={item.frames}
                    ></RangeSlider>
                  </div>
                </Typography>
              </CardContent>
            </Card>
          </>
        ))}
        <div></div>
      </div>
    </div>
  )
}

export default VideoTemplates
