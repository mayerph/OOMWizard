import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './ImageScreenshotUpload.css'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import {
  speechtotext,
  speechtotextreturn,
} from '../speechtotext/speechtotext.js'
import IconButton from '@material-ui/core/IconButton'
import MicIcon from '@material-ui/icons/Mic'
import Chip from '@material-ui/core/Chip'
import { VoiceControl } from '../VoiceControl'
import { Redirect } from 'react-router-dom'

import * as config from '../../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

class ImageScreenshotUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      screenshotnameinput: 'Enter Name',
      isUploaded: false,
    }
  }
  //check if url is legit, regex from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  //RegExp matches the text to a regular expression
  //added personal explainations to the regexp after the original comments -> in ImageUrlUpload as code is the same
  // in general this module is very similar to the url upload!
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;F&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ) // fragment locator
    return !!pattern.test(str)
  }
  //using an online api to fetch screenshots from urls given by the user, since it takes a while, there is a loading screen shown
  // axios is used on the first url to grab the url forwarded image (since the screenshotapi need to generate and forward the user to the image stored on their servers)
  // then using fetch we create a blob and turn that into a file to upload
  // where we use axios again like in the other upload components
  uploadTemplate() {
    const loading = document.getElementById('loadback')
    loading.style.visibility = 'visible'
    const con = document.getElementById('screenurlinput').value
    const containername = document.getElementById('screennameinput').value
    const container =
      'https://screenshotapi.net/api/v1/screenshot?url=' +
      con +
      '&token=OUDJTUY8KF6SXUK6ZBDOKHSA2U9NVYKA'

    if (this.validURL(con)) {
      axios.get(container).then((res) => {
        let screen = res.data.screenshot
        fetch(screen)
          .then((res) => res.blob())
          .then((blob) => {
            var nameofmeme
            if (containername) {
              var extension = 'png'
              nameofmeme = containername + '.' + extension
            } else {
              nameofmeme = con + '.png'
            }
            var newfile = new File([blob], nameofmeme, {
              type: blob.type,
            })
            var fd = new FormData()
            fd.append('template', newfile)
            axios
              .post(`${backend_uri}/templates/`, fd, {})
              .then((res) => {
                const element = {
                  x: 0,
                  y: 0,
                  width: 400,
                  bounds: '#meme-canvas',
                  type: 'image',
                  imageUrl:
                    res.config.url.replace('templates/', '') +
                    res.data.route.substring(1),
                }
                this.props.dispatch({ type: 'ADD_ELEMENT', element: element })
                this.setState({ isUploaded: true })
              })
              .then((result) => {
                this.onApiLoad()
                loading.style.visibility = 'hidden'
              })
          })
      })
    } else {
      alert('please enter a valid url!')
    }
  }
  onApiLoad() {
    getApi('api')
  }

  render() {
    let trying = false
    return (
      <>
        {this.state.isUploaded ? (
          <Redirect
            to={{
              pathname: '/imagememe',
            }}
          />
        ) : (
          <div className="urlScreenShotUpload" id="urlScreenShotUpload">
            {/*         <input type="text" id="urlinput" placeholder="Image Url" />
        <input type="text" id="nameinput" placeholder="Image Name" /> */}
            <TextField
              required
              id="screenurlinput"
              label="Image Url"
              variant="outlined"
            />
            <TextField
              required
              id="screennameinput"
              label="Image Name"
              variant="outlined"
              defaultValue={this.state.screenshotnameinput}
            />
            {/*         <button
          id="uploadButtonFile"
          type="submit"
          onClick={this.uploadTemplate.bind(this)}
        >
          Upload File
        </button> */}
            <IconButton
              variant="contained"
              color="primary"
              onClick={() => {
                speechtotext('screennameinput', trying)
                trying = !trying
              }}
            >
              <MicIcon />
            </IconButton>

            <Button
              variant="contained"
              color="primary"
              component="span"
              id="uploadButtonScreenshot"
              type="submit"
              onClick={this.uploadTemplate.bind(this)}
            >
              Upload File
            </Button>
            <div id="loadback">
              <div id="loading"></div>
            </div>

            {/* <IconButton
          variant="contained"
          color="secondary"
          onClick={() => {
            speechtocontrol('uploadButtonScreenshot')
          }}
        >
          <MicIcon />
        </IconButton>
        <Chip icon={<MicIcon />} label="Upload" color="secondary" />
        <Chip icon={<MicIcon />} label="Cancel" color="secondary" /> */}
            <VoiceControl tocontrol={'uploadButtonScreenshot'} />
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(ImageScreenshotUpload)
