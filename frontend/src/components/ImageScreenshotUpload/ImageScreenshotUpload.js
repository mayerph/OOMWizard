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

class ImageScreenshotUpload extends React.Component {
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
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ) // fragment locator
    return !!pattern.test(str)
  }
  uploadTemplate() {
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
    //sppech implementation from
    //https://www.twilio.com/blog/speech-recognition-browser-web-speech-api
    const button = document.getElementById('start_button')
    const field = document.getElementById('screennameinput')
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    let trying = false
    const speech = new SpeechRecognition()
    console.log(speech)
    speech.onresult = console.log
    const start = () => {
      console.log('started')
      speech.start()
    }
    const stop = () => {
      console.log('stoped')
      speech.stop()
    }
    const onResult = (event) => {
      const results = document.getElementById('results')
      results.innerHTML = ''
      for (const res of event.results) {
        let result = res[0].transcript
        const text = document.createTextNode(res[0].transcript)
        const p = document.createElement('p')
        console.log(result)
        if (res.isFinal) {
          p.classList.add('final')
        }
        p.appendChild(text)
        results.appendChild(p)
      }
    }
    speech.continuous = true
    speech.interimResults = true
    speech.addEventListener('result', onResult)
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
        />
        {/*         <button
          id="uploadButtonFile"
          type="submit"
          onClick={this.uploadTemplate.bind(this)}
        >
          Upload File
        </button> */}

        <Button
          variant="contained"
          color="primary"
          component="span"
          id="uploadButtonFile"
          type="submit"
          onClick={this.uploadTemplate.bind(this)}
        >
          Upload File
        </Button>
        <button
          id="start_button"
          onClick={() => {
            trying ? stop() : start()
            trying = !trying
          }}
        ></button>
        <div id="results"></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, { getApi })(ImageScreenshotUpload)
