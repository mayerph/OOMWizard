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

function FrameSelector(props) {
  const { frames, callback } = props
  const valuetext = (value) => {
    return `${value}`
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
        min={0}
        max={frames.length}
        onChange={handleChange}
        valueLabelDisplay="auto"
      />
    </div>
  )
}

function RangeSlider(props) {
  const { frames, callback, config } = props

  const classes = useStyles()
  const [value, setValue] = React.useState(config)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    callback(newValue)
  }

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        Select Frames
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        max={props.frames}
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
      frames: [0, 30],
    },
    {
      id: uuidv4(),
      text: 'hello universe',
      x: 20,
      y: 60,
      frames: [0, 30],
    },
    {
      id: uuidv4(),
      text: 'hello mars',
      x: 30,
      y: 70,
      frames: [0, 30],
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
  const [stepSize, setStepSize] = useState(10)
  const [activeCaption, setActiveCaption] = useState(captionList[0])
  const [activeFrame, setActiveFrame] = useState(frames[0])

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

  useEffect(() => {
    drawImage()
  }, [])

  const baseImage = new Image()
  console.log('_------>', activeFrame.url)

  const drawImage = () => {
    baseImage.src = activeFrame.url
    const canvas = document.getElementById('meme')
    const context = canvas.getContext('2d')

    context.clearRect(0, 0, baseImage.width, baseImage.height)

    context.canvas.width = baseImage.width
    context.canvas.height = baseImage.height
    context.drawImage(baseImage, 0, 0)
    captionList.forEach((e) => {
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
      frames: [0, 30],
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

  const setActive = (index) => {
    setActiveCaption(captionList[index])
  }

  const handleChange = (e, index) => {
    const { value } = e.target
    captionList[index].text = value
    const temp = [...captionList]
    setCaptionList(temp)
  }

  const redefineFrameRange = (e, index) => {
    captionList[index].frames = e
    setCaptionList([...captionList])
  }

  const deleteCaption = (index) => {
    const newList = [...captionList]

    const t = newList.filter((e, i) => i !== index)

    setCaptionList(t)
  }

  const setVisibleFrame = (index) => {
    setActiveFrame(frames[index])
  }

  useEffect(() => {
    console.log('activeFrame')
    drawImage()
  }, [activeFrame])

  useEffect(() => {
    console.log('captionList')
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
          frames={frames}
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
                      frames={20}
                      callback={(e) => {
                        redefineFrameRange(e, index)
                      }}
                      config={[0, 5]}
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
