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

class ImageScreenshotUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      screenshotnameinput: 'Enter Name',
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
  uploadTemplate() {
    const loading = document.getElementById('loadback')
    loading.style.visibility = 'visible'
    const con = document.getElementById('screenurlinput').value
    const containername = document.getElementById('screennameinput').value
    const container =
      'https://screenshotapi.net/api/v1/screenshot?url=' +
      con +
      '&token=OUDJTUY8KF6SXUK6ZBDOKHSA2U9NVYKA'
    console.log(container)
    console.log(containername)

    if (this.validURL(con)) {
      axios.get(container).then((res) => {
        console.log(res.data)
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
              .post('http://localhost:2000/templates/', fd, {})
              .then((res) => {
                console.log(res.statusText)
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
    this.props.getApi('api')
  }

  render() {
    //speech implementation from
    //https://www.twilio.com/blog/speech-recognition-browser-web-speech-api
    let trying = false
    return (
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
            //console.log(trying)
            speechtotext('screennameinput', trying)
            //console.log(trying)
            trying = !trying
            //let test
            //test = speechtotextreturn(trying)
            //console.log(test)
            //const results = document.getElementById('results').innerHTML
            //console.log(results)
            //trying = !trying
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
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, { getApi })(ImageScreenshotUpload)
