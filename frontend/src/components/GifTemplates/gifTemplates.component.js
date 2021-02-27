import React, {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'
import { connect } from 'react-redux'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core'
import './gifTemplates.style.css'
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
import { HuePicker, SketchPicker, ChromePicker } from 'react-color'

import Button from '@material-ui/core/Button'

import {
  AddOutlined,
  ArrowUpward,
  ArrowDownward,
  ArrowForward,
  ArrowBack,
  CloudDownload,
  PlayCircleFilled,
  Palette,
} from '@material-ui/icons/'
import {
  getGifTemplates,
  addCaptionToActiveTemplate,
  updateFramesOfActiveTemplate,
  updateCaptions,
  setActiveTemplate,
  generateGifMeme,
  setActiveFrame,
} from '../../actions/gifTemplate.action'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'
import { speechtotextreturn } from '../speechtotext/speechtotext.js'
import MicIcon from '@material-ui/icons/Mic'

import RangeSlider from './helper/rangeSlider.component'
import FrameSelector from './helper/frameSelector.component'
import GifTemplateList from './helper/gifTemplateList.component'
import CustomAccordion from './helper/accordion.component'
import * as config from '../../config.json'
import ColorPickerDialog from './helper/colorpickerDialog.component'
import { get } from 'lodash'

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
}))

const GifTemplates = (props) => {
  const [stepSize, setStepSize] = useState(10)
  const [activeCaption, setActiveCaption] = useState(0)

  const debug = false
  const [colorpickerOpen, setColorpickerOpen] = useState(false)
  let templateGif = React.useRef(null)
  let templateGifSource = React.useRef(null)
  const gifplayerRef = useRef()
  const gifsrcRef = useRef()
  let gifplayer

  const dispatch = useDispatch()
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

  let baseImage = new Image()

  const getCaptions = () => {
    return gifTemplateState.data.captions
  }

  const getMeme = () => {
    return gifTemplateState.data.meme
  }
  const getActiveTemplate = () => {
    return gifTemplateState.data.activeTemplate
  }

  const getActiveFrameIndex = () => {
    return gifTemplateState.data.activeFrame
  }

  const getActiveFrame = () => {
    return getActiveTemplate().frames[getActiveFrameIndex()]
  }
  const drawImage = () => {
    if (gifTemplateState.data.activeTemplate) {
      console.log('nun sind wir hier richtig')
      baseImage = getActiveFrame().image
      //baseImage.src = `${destination}/${getActiveFrame().route}`
      console.log('the baseimage is', baseImage)
      const canvas = document.getElementById('meme2')
      const context = canvas.getContext('2d')

      context.clearRect(0, 0, baseImage.width, baseImage.height)

      context.canvas.width = baseImage.width
      context.canvas.height = baseImage.height
      context.drawImage(baseImage, 0, 0)
      getActiveFrame().captions.forEach((e) => {
        context.font = `bold ${e.size}pt Arial`
        context.fillStyle = e.color
        context.fillText(e.text, e.x, e.y)
      })

      //setDrawing(!drawing)
    }
  }

  const add = () => {
    const newCaption = {
      id: uuidv4(),
      text: 'placeholder',
      x: 40,
      y: 80,
      frames: [0, _.values(getActiveTemplate().frames).length - 1],
      color: '#000000',
      size: 30,
    }

    dispatch(addCaptionToActiveTemplate(newCaption))

    updateCaptionsInFrames(
      { new: newCaption.frames, old: undefined },
      newCaption,
    )
  }

  const up = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].y = captionsTemp[activeCaption].y - stepSize
    dispatch(updateCaptions(captionsTemp))
  }

  const down = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].y = captionsTemp[activeCaption].y + stepSize

    dispatch(updateCaptions(captionsTemp))
  }

  const right = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].x = captionsTemp[activeCaption].x + stepSize
    dispatch(updateCaptions(captionsTemp))
  }

  const left = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].x = captionsTemp[activeCaption].x - stepSize

    dispatch(updateCaptions(captionsTemp))
  }

  const setActive = (index) => {
    setActiveCaption(index)
  }

  const updateCaptionsInFrames = (frames, itemToDelete) => {
    const frameVector = [...getActiveTemplate().frames]
    if (frames.new != frames.old) {
      // delete items
      if (frames.old !== undefined) {
        for (let i = frames.old[0]; i <= frames.old[1]; i++) {
          frameVector[i].captions = frameVector[i].captions.filter((item) => {
            if (
              item.id !=
              (itemToDelete
                ? itemToDelete.id
                : getActiveFrame().captions[activeCaption].id)
            ) {
              return item
            }
          })
        }
      }

      // add items
      if (frames.new !== undefined) {
        for (let i = frames.new[0]; i <= frames.new[1]; i++) {
          frameVector[i].captions = _.uniqBy(
            []
              .concat(frameVector[i].captions)
              .concat(itemToDelete ? itemToDelete : frameVector[activeCaption]),
            'id',
          )
        }
      }

      dispatch(updateFramesOfActiveTemplate(frameVector))
      // ---> todo setFrameList(frameList)
    }
  }

  const handleChange = (e, index) => {
    const captionVec = [...getCaptions()]
    const { value } = e.target
    captionVec[index].text = value
    dispatch(updateCaptions(captionVec))
  }

  // update captions in frameList (only for rendering)
  const redefineFrameRange = (e, index) => {
    const captionVec = [...getCaptions()]
    captionVec[index].frames = e.new
    updateCaptionsInFrames(e, captionVec[index])
    dispatch(updateCaptions(captionVec))
  }

  const deleteCaption = (index, id) => {
    const newList = [...getCaptions()]
    const itemToDelete = { ...newList[index] }

    const t = newList.filter((e, i) => e.id !== id)
    dispatch(updateCaptions(t))

    updateCaptionsInFrames(
      { new: undefined, old: itemToDelete.frames },
      itemToDelete,
    )
  }

  const setVisibleFrame = (index) => {
    dispatch(setActiveFrame(index))
  }

  // Allows you to extract data from the Redux store state, using a selector function.
  const gifTemplateState = useSelector((state) => {
    if (
      !state.gifTemplatesReducer.error &&
      state.gifTemplatesReducer.data.gifTemplates
    ) {
      return state.gifTemplatesReducer
    }
  })

  //setFrameList(templates[0].frames.frames)

  React.useEffect(() => {
    if (gifTemplateState.data.gifTemplates.length > 0) {
      if (gifTemplateState.data.captions.length > 0) {
        //initDrawing()
      }
      if (gifTemplateState.action == 'SET_ACTIVE_TEMPLATE_GIF') {
        //setActiveFrame(0)
      }

      drawImage()
    }

    setTimeout(() => {
      drawImage()
    }, 1000)
    //drawImage()
  }, [gifTemplateState])

  // enables side effects like http requests
  React.useEffect(() => {
    dispatch(getGifTemplates())
  }, [dispatch])

  useEffect(() => {
    const captionVec = [...getCaptions()]
    captionVec.map((item) => {
      if (item.id == captionVec[activeCaption].id) {
        return captionVec[activeCaption]
      }
      return item
    })
    dispatch(updateCaptions(captionVec))
  }, [activeCaption])

  const classes = useStyles()
  let trying = false

  const setActiveTemplate_ = (index) => {
    dispatch(setActiveTemplate(index))
  }

  const prepare = () => {
    const memeTemplate = _.cloneDeep({ ...getActiveTemplate() })
    const frames_temp = []
    memeTemplate.frames.forEach((e) => {
      const cap = []
      e.captions.forEach((c) => {
        cap.push({
          text: c.text,
          position: {
            x: c.x,
            y: c.y,
          },
          color: c.color,
          size: c.size,
        })
      })
      e.captions = cap
      frames_temp.push(e)
    })
    memeTemplate.frames = frames_temp

    return {
      meme: memeTemplate,
    }
  }

  const generateMeme = () => {
    dispatch(generateGifMeme(prepare()))
  }

  const Debug = () => {
    if (debug) {
      return (
        <span>
          {gifTemplateState.data.activeTemplate.frames.length}
          {gifTemplateState.data.gifTemplates.map((e) => (
            <div key={uuidv4()}>
              {JSON.stringify(gifTemplateState.data.captions)}
            </div>
          ))}

          <button
            onClick={() => {
              console.log('prepare', JSON.stringify(prepare()))
            }}
          >
            test2
          </button>
          <button
            onClick={() => {
              dispatch(
                addCaptionToActiveTemplate({
                  id: uuidv4(),
                  text: 'hello test',
                  x: 30,
                  y: 70,
                  frames: [0, 2],
                }),
              )
            }}
          >
            test
          </button>
        </span>
      )
    } else {
      return <span></span>
    }
  }

  if (getMeme()) {
    gifplayer = (
      <>
        {' '}
        <img src={`${destination}${getMeme().route}`}></img>
      </>
    )
  } else {
    gifplayer = ''
  }

  let memePart
  if (gifTemplateState.data.activeTemplate != undefined) {
    memePart = (
      <span>
        <div className="sticky-container">
          <Card className="frame-show">
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                <div className="gif-presentation">
                  <canvas id="meme2"></canvas>
                  <FrameSelector
                    className="frame-selector"
                    frames={getActiveTemplate().frames}
                    callback={(e) => {
                      setVisibleFrame(e)
                    }}
                  ></FrameSelector>
                </div>

                <div className="gif-presentation">
                  <img
                    src={`${destination}${gifTemplateState.data.activeTemplate.route}`}
                  ></img>
                </div>
                <div className="gif-presentation">
                  <div
                    style={{
                      height: '100%',
                      width: 'auto',
                    }}
                  ></div>
                  {gifplayer}
                </div>
              </Typography>
            </CardContent>

            <CardContent></CardContent>
          </Card>
          <div className="action-bar">
            <Button
              onClick={add}
              variant="contained"
              color="primary"
              className="action-btn"
            >
              <AddOutlined />
            </Button>
            <Button
              className="action-btn"
              variant="contained"
              onClick={() => {
                if (getCaptions()[activeCaption]) {
                  left()
                }
              }}
            >
              <ArrowBack />
            </Button>
            <Button
              className="action-btn"
              variant="contained"
              onClick={() => {
                if (getCaptions()[activeCaption]) {
                  right()
                }
              }}
            >
              <ArrowForward />
            </Button>
            <Button
              className="action-btn"
              variant="contained"
              onClick={() => {
                if (getCaptions()[activeCaption]) {
                  up()
                }
              }}
            >
              <ArrowUpward />
            </Button>
            <Button
              className="action-btn"
              variant="contained"
              onClick={() => {
                if (getCaptions()[activeCaption]) {
                  down()
                }
              }}
            >
              <ArrowDownward />
            </Button>
            <Button
              className="action-btn"
              variant="contained"
              onClick={() => {
                if (getCaptions()[activeCaption]) {
                  generateMeme()
                }
              }}
            >
              <CloudDownload />
            </Button>
          </div>
        </div>
        <div className="caption-container-parent">
          <div className="caption-container-child">
            <div>
              {getCaptions().map((item, index) => (
                <>
                  <div
                    key={item.id}
                    onClick={(e) => {
                      setActive(index)
                    }}
                  >
                    <Card
                      className={`caption-card ${
                        item.id ==
                        (getCaptions()[activeCaption]
                          ? getCaptions()[activeCaption].id
                          : '')
                          ? 'active-item'
                          : ''
                      }`}
                    >
                      <CardHeader
                        action={
                          <IconButton aria-label="settings">
                            <CloseButton
                              onClick={() => {
                                deleteCaption(index, item.id)
                              }}
                            />
                          </IconButton>
                        }
                        title={`Caption ${index + 1}`}
                      />
                      <CardContent>
                        <Typography
                          component={'span'}
                          className={classes.title}
                          color="textSecondary"
                          gutterBottom
                        >
                          <div className="caption-option">
                            <TextField
                              className="caption-input"
                              label="Caption"
                              defaultValue={getCaptions()[index].text}
                              onChange={(e) => {
                                handleChange(e, index)
                              }}
                              variant="outlined"
                            />
                            <div>
                              <IconButton
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  speechtotextreturn(trying)
                                  const results = document.getElementById(
                                    'results',
                                  ).innerHTML
                                  trying = !trying
                                }}
                              >
                                <MicIcon />
                              </IconButton>
                            </div>
                          </div>
                          <div className="caption-option">
                            {
                              <RangeSlider
                                index={index}
                                frames={getActiveTemplate().frames}
                                callback={(e) => {
                                  redefineFrameRange(e, index)
                                }}
                                config={getCaptions()[index].frames}
                              ></RangeSlider>
                            }
                          </div>
                          <div className="caption-option">
                            <IconButton
                              style={{ color: getCaptions()[index].color }}
                              onClick={() => {
                                setColorpickerOpen(true)
                              }}
                            >
                              <Palette />
                            </IconButton>

                            <ColorPickerDialog
                              open={colorpickerOpen}
                              defaultColor={getCaptions()[index].color}
                              handleClose={() => {
                                setColorpickerOpen(false)
                              }}
                              handleOk={(color) => {
                                const captionsVec = [...getCaptions()]
                                captionsVec[index].color = color
                                dispatch(updateCaptions(captionsVec))
                                setColorpickerOpen(false)
                              }}
                            ></ColorPickerDialog>
                            <input
                              type="number"
                              id="tentacles"
                              name="tentacles"
                              min="0"
                              max="1000"
                              value={getCaptions()[index].size}
                              onChange={(a) => {
                                const captionsVec = [...getCaptions()]

                                captionsVec[index].size = a.target.value
                                dispatch(updateCaptions(captionsVec))
                              }}
                            />
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ))}
              <div></div>
            </div>
          </div>
        </div>
        ;
      </span>
    )
  } else {
    memePart = <span></span>
  }

  return (
    <div className="meme-generator-body">
      <Debug></Debug>
      <CustomAccordion className="der-test">
        <GifTemplateList
          gifs={gifTemplateState.data.gifTemplates}
          active={
            gifTemplateState.data.activeIndex
              ? gifTemplateState.data.activeIndex
              : -1
          }
          callback={setActiveTemplate_}
        ></GifTemplateList>
      </CustomAccordion>
      {memePart}
    </div>
  )
}

export default GifTemplates
