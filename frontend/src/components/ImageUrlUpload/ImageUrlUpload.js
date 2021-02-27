import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './ImageUrlUpload.css'
import { Redirect } from 'react-router-dom'
import {
  speechtotext,
  speechtotextreturn,
} from '../speechtotext/speechtotext.js'
import IconButton from '@material-ui/core/IconButton'
import MicIcon from '@material-ui/icons/Mic'

class ImageUrlUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pictureUrl: null,
      nameinput: 'Enter Name',
    }
  }
  //check if url is legit, regex from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  //RegExp matches the text to a regular expression
  //added personal explainations to the regexp after the original comments
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol -> check if the string starts with http or https followed by :// or doesn't start with any option
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name -> makes sure that the url has at least one character before the period, then allows any amount of letters, numbers and hyphens, then any number of letters or numbers. Afterwards a period must come followed by either at least 2 letters (e.g. .com or .de) OR
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address -> match this structure [1-3 digits].[1-3 digits].[1-3 digits].[1-3 digits]] AND THEN optionally
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path -> a : is followed by any number of numbers -> so either a domain ending or a ip address ending and optional port => afterwards optionally match the url queries, continued on next line
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string -> optional amount of '/' followed by a combination of letters, digits, and given symbols then optionally followed by letters, digits and a different range of symbols
        '(\\#[-a-z\\d_]*)?$', //at the end optionally a '#' followed by any amount of letters, digits and _ symbol
      'i',
    ) // fragment locator
    return !!pattern.test(str)
  }
  uploadTemplate() {
    const container = document.getElementById('urlinput').value
    const containername = document.getElementById('nameinput').value
    console.log(container)
    console.log(containername)
    if (this.validURL(container)) {
      fetch(container)
        .then((res) => res.blob())
        .then((blob) => {
          var nameofmeme
          if (containername) {
            var extension = container.split('.').pop()
            nameofmeme = containername + '.' + extension
          } else {
            nameofmeme = container.split('/').pop()
          }
          console.log(nameofmeme)
          var newfile = new File([blob], nameofmeme, {
            type: blob.type,
          })
          var fd = new FormData()
          fd.append('template', newfile)
          axios
            .post('http://localhost:2000/templates/', fd, {})
            .then((res) => {
              console.log(res.statusText)
              this.setState({
                pictureUrl:
                  res.config.url.replace('templates/', '') +
                  res.data.route.substring(1),
              })
            })
            .then((result) => {
              this.onApiLoad()
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
    let trying = false
    return (
      <div>
        {this.state.pictureUrl ? (
          <Redirect
            to={{
              pathname: '/imagememe',
              state: {
                imageUrls: [this.state.pictureUrl],
              },
            }}
          />
        ) : (
          <div className="urlUpload" id="urlUpload">
            {/*         <input type="text" id="urlinput" placeholder="Image Url" />
        <input type="text" id="nameinput" placeholder="Image Name" /> */}
            <TextField
              required
              id="urlinput"
              label="Image Url"
              variant="outlined"
            />
            <TextField
              required
              id="nameinput"
              label="Image Name"
              variant="outlined"
              value={this.state.nameinput}
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
                console.log(trying)
                speechtotext('nameinput', trying)
                trying = !trying
              }}
            >
              <MicIcon />
            </IconButton>

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
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, { getApi })(ImageUrlUpload)
