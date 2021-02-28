import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './gifTemplates.style.css'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
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

/**
 * component containing all the gif functionality
 * @param {*} props properties of the component
 */
const GifTemplates = (props) => {
  /**
   * step size for moving the caption
   */
  const [stepSize, setStepSize] = useState(10)

  /**
   * index of the currently active caption
   */
  const [activeCaption, setActiveCaption] = useState(0)

  /**
   * information if the speech-to-text is active
   */
  const [trying, setTrying] = useState(false)

  /**
   * enables debug functionality
   */
  const debug = false

  /**
   * information if the colorpicker-dialog is currently active
   */
  const [colorpickerOpen, setColorpickerOpen] = useState(false)

  /**
   * the media player / editor for the gif meme
   */
  let gifplayer

  /**
   * enables redux
   */
  const dispatch = useDispatch()

  /**
   * currently active image / frame in gif player / editor
   */
  let baseImage = new Image()

  /**
   * returns all captions
   */
  const getCaptions = () => {
    return gifTemplateState.data.captions
  }

  /**
   * returns the generated meme
   */
  const getMeme = () => {
    return gifTemplateState.data.meme
  }

  /**
   * returns the selected template
   */
  const getActiveTemplate = () => {
    return gifTemplateState.data.activeTemplate
  }

  /**
   * returns the index of the active frame
   */
  const getActiveFrameIndex = () => {
    return gifTemplateState.data.activeFrame
  }

  /**
   * returns the active frame
   */
  const getActiveFrame = () => {
    return getActiveTemplate().frames[getActiveFrameIndex()]
  }

  /**
   * draws the canvas each time the states changes
   */
  const drawImage = () => {
    if (gifTemplateState.data.activeTemplate) {
      baseImage = getActiveFrame().image

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
    }
  }

  /**
   * adds a new caption the meme
   */
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

  /**
   * moves the active caption upwards
   */
  const up = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].y = captionsTemp[activeCaption].y - stepSize
    dispatch(updateCaptions(captionsTemp))
  }

  /**
   * moves the active caption downwards
   */
  const down = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].y = captionsTemp[activeCaption].y + stepSize

    dispatch(updateCaptions(captionsTemp))
  }

  /**
   * moves the caption to the right
   */
  const right = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].x = captionsTemp[activeCaption].x + stepSize
    dispatch(updateCaptions(captionsTemp))
  }

  /**
   * moves the caption to the left
   */
  const left = () => {
    const captionsTemp = [...getCaptions()]
    captionsTemp[activeCaption].x = captionsTemp[activeCaption].x - stepSize

    dispatch(updateCaptions(captionsTemp))
  }

  /**
   * sets a new active caption
   * @param {*} index index of the clicked caption
   */
  const setActive = (index) => {
    setActiveCaption(index)
  }

  /**
   * updates the captions in all frames. deletes captions and adds captions
   * @param {*} frames contains the old and new frame range of the caption
   * @param {*} itemToDelete the caption which should be deleted
   */
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

  /**
   * gets called when the textfield changes. updates the caption with new text.
   * @param {*} e html element / textfield
   * @param {*} index index of the caption
   */
  const handleChange = (e, index) => {
    const captionVec = [...getCaptions()]
    const { value } = e.target
    captionVec[index].text = value
    dispatch(updateCaptions(captionVec))
  }

  /**
   * gets called if the frame range of the caption changes
   * @param {*} e consinsts of the new and old frame range of the caption
   * @param {*} index index of the caption
   */
  const redefineFrameRange = (e, index) => {
    const captionVec = [...getCaptions()]
    captionVec[index].frames = e.new
    updateCaptionsInFrames(e, captionVec[index])
    dispatch(updateCaptions(captionVec))
  }

  /**
   * deletes caption
   * @param {*} index of the caption
   * @param {*} id of the caption
   */
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

  /**
   * sets the visible frame in the gif player / editor
   * @param {*} index of the frame
   */
  const setVisibleFrame = (index) => {
    dispatch(setActiveFrame(index))
  }

  /**
   * redux store with all gif template information
   */
  const gifTemplateState = useSelector((state) => {
    if (
      !state.gifTemplatesReducer.error &&
      state.gifTemplatesReducer.data.gifTemplates
    ) {
      return state.gifTemplatesReducer
    }
  })

  /**
   * gets called when the gifTemplateState of the redux store changes
   */
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

  /**
   * when the redux is successful imported the gif templates are requested from the server
   */
  React.useEffect(() => {
    dispatch(getGifTemplates())
  }, [dispatch])

  /**
   * gets called when an other caption is clicked. Updates the captions
   */
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

  /**
   * gets called when the user clicks another template
   * @param {} index index of the template
   */
  const setActiveTemplate_ = (index) => {
    dispatch(setActiveTemplate(index))
  }

  /**
   * prepares the template data for the generation of the meme
   */
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
  /**
   * generates the meme
   */
  const generateMeme = () => {
    dispatch(generateGifMeme(prepare()))
  }

  /**
   * html data for debugging
   */
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
  /**
   * html data for the gif player / editor
   */
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

  /**
   * html for the meme part (gif editor, result, template)
   * only visible when a template is selected
   */
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
        <ColorPickerDialog
          open={colorpickerOpen}
          defaultColor={
            getCaptions().length > 0
              ? getCaptions()[activeCaption].color
              : 'black'
          }
          handleClose={() => {
            setColorpickerOpen(false)
          }}
          handleOk={(color) => {
            const captionsVec = [...getCaptions()]
            captionsVec[activeCaption].color = color
            dispatch(updateCaptions(captionsVec))
            setColorpickerOpen(false)
          }}
        ></ColorPickerDialog>
      </span>
    )
  } else {
    memePart = <span></span>
  }
  /**
   * returns the whole html
   */
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
