import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'
import Button from '@material-ui/core/Button'
import './ImageUpload.css'
import Input from '@material-ui/core/Input'
import { Redirect } from 'react-router-dom'
import { VoiceControl } from '../VoiceControl'

import * as config from '../../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

class ImageUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUploaded: false,
    }
  }
  uploadTemplate() {
    const container = document.getElementById('templateUpload')
    const file = container.querySelector('input[type="file"]').files[0]
    const fd = new FormData()
    fd.append('template', file)
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
      })
  }
  onApiLoad() {
    getApi('api')
  }

  render() {
    return (
      <div>
        {this.state.isUploaded ? (
          <Redirect
            to={{
              pathname: '/imagememe',
            }}
          />
        ) : (
          <div className="templateUpload" id="templateUpload">
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              id="fileupload"
            />
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
            <VoiceControl tocontrol={'uploadButtonFile'} />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(ImageUpload)
