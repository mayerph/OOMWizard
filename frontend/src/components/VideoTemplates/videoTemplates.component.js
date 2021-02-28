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
  getVideoTemplates,
  addCaptionToActiveTemplate,
  updateFramesOfActiveTemplate,
  updateCaptions,
  setActiveTemplate,
  generateVideoMeme,
  setActiveFrame,
} from '../../actions/videoTemplate.action'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'
import { speechtotextreturn } from '../speechtotext/speechtotext.js'
import MicIcon from '@material-ui/icons/Mic'

import RangeSlider from './helper/rangeSlider.component'
import FrameSelector from './helper/frameSelector.component'
import VideoTemplateList from './helper/videoTemplateList.component'
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

const VideoTemplates = (props) => {
  const [stepSize, setStepSize] = useState(10)
  const [activeCaption, setActiveCaption] = useState(0)

  const debug = false
  const [colorpickerOpen, setColorpickerOpen] = useState(false)
  let templateVideo = React.useRef(null)
  let templateVideoSource = React.useRef(null)
  const videoplayerRef = useRef()
  const videosrcRef = useRef()
  const hiddenSpeechRef = useRef()
  let videoplayer

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
    return videoTemplateState.data.captions
  }

  const getMeme = () => {
    return videoTemplateState.data.meme
  }
  const getActiveTemplate = () => {
    return videoTemplateState.data.activeTemplate
  }

  const getActiveFrameIndex = () => {
    return videoTemplateState.data.activeFrame
  }

  const getActiveFrame = () => {
    return getActiveTemplate().frames.frames[getActiveFrameIndex()]
  }
  const drawImage = () => {
    if (videoTemplateState.data.activeTemplate) {
      baseImage = getActiveFrame().image
      //baseImage.src = `${destination}/${getActiveFrame().route}`

      const canvas = document.getElementById('meme')
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
      frames: [0, _.values(getActiveTemplate().frames.frames).length - 1],
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
    const frameVector = [...getActiveTemplate().frames.frames]
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
  const videoTemplateState = useSelector((state) => {
    if (
      !state.videoTemplatesReducer.error &&
      state.videoTemplatesReducer.data.videoTemplates
    ) {
      return state.videoTemplatesReducer
    }
  })

  //setFrameList(templates[0].frames.frames)

  React.useEffect(() => {
    if (videoTemplateState.data.videoTemplates.length > 0) {
      if (videoTemplateState.data.captions.length > 0) {
        //initDrawing()
      }

      if (
        templateVideo &&
        templateVideo.current &&
        videoTemplateState.action == 'SET_ACTIVE_TEMPLATE'
      ) {
        //templateVideoSource.current.src = getActiveTemplate().route
        templateVideo.current.load()
      }

      if (
        videoplayerRef &&
        videoplayerRef.current &&
        videoTemplateState.action == 'GENERATE_VIDEO_MEME'
      ) {
        //templateVideoSource.current.src = getActiveTemplate().route
        videoplayerRef.current.load()
      }

      drawImage()
    }

    setTimeout(() => {
      drawImage()
    }, 1000)
    //drawImage()
  }, [videoTemplateState])

  // enables side effects like http requests
  React.useEffect(() => {
    dispatch(getVideoTemplates())
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
  const [trying, setTrying] = useState(false)

  const setActiveTemplate_ = (index) => {
    dispatch(setActiveTemplate(index))
  }

  const prepare = () => {
    const memeTemplate = _.cloneDeep({ ...getActiveTemplate() })
    const frames_temp = []
    memeTemplate.frames.frames.forEach((e) => {
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
    memeTemplate.frames.frames = frames_temp

    return {
      meme: memeTemplate,
    }
  }

  const generateMeme = () => {
    dispatch(generateVideoMeme(prepare()))
  }

  const Debug = () => {
    if (debug) {
      return (
        <span>
          {videoTemplateState.data.activeTemplate.frames.frames.length}
          {videoTemplateState.data.videoTemplates.map((e) => (
            <div key={uuidv4()}>
              {JSON.stringify(videoTemplateState.data.captions)}
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
    videoplayer = (
      <video className="meme-video" controls ref={videoplayerRef}>
        <source
          ref={videosrcRef}
          src={`${destination}${getMeme().route}`}
          type="video/mp4"
        />
      </video>
    )
  } else {
    videoplayer = ''
  }

  let memePart
  if (videoTemplateState.data.activeTemplate != undefined) {
    memePart = (
      <span>
        <div className="sticky-container">
          <Card className="frame-show">
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                <div className="video-presentation">
                  <canvas id="meme"></canvas>
                  <FrameSelector
                    className="frame-selector"
                    frames={getActiveTemplate().frames.frames}
                    callback={(e) => {
                      setVisibleFrame(e)
                    }}
                  ></FrameSelector>
                </div>

                <div className="video-presentation">
                  <video
                    controls
                    className="template-video"
                    ref={templateVideo}
                  >
                    <source
                      ref={templateVideoSource}
                      src={`${destination}${videoTemplateState.data.activeTemplate.route}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div className="video-presentation">
                  <div
                    style={{
                      height: '100%',
                      width: 'auto',
                    }}
                  ></div>
                  {videoplayer}
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
                          <div className="caption-option textfield-container-parent">
                            <div className="textfield-container">
                              <TextField
                                className="caption-input"
                                label="Caption"
                                value={getCaptions()[index].text}
                                onChange={(e) => {
                                  handleChange(e, index)
                                }}
                                variant="outlined"
                              />
                            </div>
                            <div>
                              <span id="results" hidden></span>
                              <IconButton
                                variant="contained"
                                className={`${
                                  trying ? 'microphone-on' : 'microphone-off '
                                }`}
                                onClick={() => {
                                  speechtotextreturn(trying)
                                  const results = document.getElementById(
                                    'results',
                                  ).innerHTML
                                  if (trying) {
                                    const tempCaptions = [...getCaptions()]
                                    tempCaptions[index].text = results

                                    dispatch(updateCaptions(tempCaptions))
                                  }

                                  setTrying(!trying)
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
                                frames={getActiveTemplate().frames.frames}
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
        <VideoTemplateList
          videos={videoTemplateState.data.videoTemplates}
          active={
            videoTemplateState.data.activeIndex
              ? videoTemplateState.data.activeIndex
              : -1
          }
          callback={setActiveTemplate_}
        ></VideoTemplateList>
      </CustomAccordion>
      {memePart}
    </div>
  )
}

export default VideoTemplates
