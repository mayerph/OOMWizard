import React, {
  forwardRef,
  useEffect,
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

import Button from '@material-ui/core/Button'

import {
  AddOutlined,
  ArrowUpward,
  ArrowDownward,
  ArrowForward,
  ArrowBack,
  CloudDownload,
  PlayCircleFilled,
} from '@material-ui/icons/'
import {
  getVideoTemplates,
  addCaptionToActiveTemplate,
  updateFramesOfActiveTemplate,
  updateCaptions,
  setActiveTemplate,
  generateVideoMeme,
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

const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
}))

const VideoTemplates = (props) => {
  const [stepSize, setStepSize] = useState(10)
  const [activeCaption, setActiveCaption] = useState(0)
  const [activeFrame, setActiveFrame] = useState(0)
  const debug = false
  let templateVideo = React.useRef(null)
  let templateVideoSource = React.useRef(null)

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

  const getActiveFrame = () => {
    return getActiveTemplate().frames.frames[activeFrame]
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
        context.font = '30px Arial'
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
    setActiveFrame(index)
  }

  useEffect(() => {
    drawImage()
  }, [activeFrame])

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
      console.log('dafda', templateVideo.current)
      if (
        templateVideo &&
        templateVideo.current &&
        videoTemplateState.action == 'SET_ACTIVE_TEMPLATE'
      ) {
        //templateVideoSource.current.src = getActiveTemplate().route
        templateVideo.current.load()
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
  let trying = false

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
          color: 'black',
          size: 30,
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

  const Videoplayer = () => {
    if (getMeme()) {
      return (
        <video className="meme-video" controls>
          <source src={`${destination}${getMeme().route}`} type="video/mp4" />
        </video>
      )
    } else {
      return ''
    }
  }
  let memePart
  if (videoTemplateState.data.activeTemplate != undefined) {
    memePart = (
      <span>
        <Card className="frame-show">
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              <div className="video-presentation">
                <canvas id="meme"></canvas>
              </div>

              <div className="video-presentation">
                <video controls className="template-video" ref={templateVideo}>
                  <source
                    ref={templateVideoSource}
                    src={`${destination}${videoTemplateState.data.activeTemplate.route}`}
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="video-presentation">
                <Videoplayer></Videoplayer>
              </div>
            </Typography>
          </CardContent>

          <CardContent>
            <FrameSelector
              frames={getActiveTemplate().frames.frames}
              callback={(e) => {
                setVisibleFrame(e)
              }}
            ></FrameSelector>
          </CardContent>
        </Card>
        <div className="caption-container-parent">
          <div className="caption-container-child">
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
                  left()
                }}
              >
                <ArrowBack />
              </Button>
              <Button
                className="action-btn"
                variant="contained"
                onClick={() => {
                  right()
                }}
              >
                <ArrowForward />
              </Button>
              <Button
                className="action-btn"
                variant="contained"
                onClick={() => {
                  up()
                }}
              >
                <ArrowUpward />
              </Button>
              <Button
                className="action-btn"
                variant="contained"
                onClick={() => {
                  down()
                }}
              >
                <ArrowDownward />
              </Button>
              <Button
                className="action-btn"
                variant="contained"
                onClick={generateMeme}
              >
                <CloudDownload />
              </Button>
            </div>
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
                            <IconButton
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                //console.log(trying)
                                //let test = speechtotextreturn(item.id, trying)
                                //console.log(test)
                                //trying = !trying
                                speechtotextreturn(trying)
                                const results = document.getElementById(
                                  'results',
                                ).innerHTML
                                trying = !trying
                              }}
                            >
                              <MicIcon />
                            </IconButton>
                            <p
                              id="results"
                              style={{ visibility: 'hidden' }}
                            ></p>
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
