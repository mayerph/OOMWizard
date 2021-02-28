import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'
import { ReactPainter } from 'react-painter'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { VoiceControl } from '../VoiceControl'

import './ImagePainter.css'

class ImagePainter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUploaded: null,
    }
  }
  onApiLoad() {
    getApi('api')
  }

  render() {
    return (
      <div className="memedraw">
        <ReactPainter
          width={500}
          height={500}
          onSave={(blob) => {
            console.log(blob)
            var touse = blob
            var date = new Date().valueOf()
            var newfile = new File([touse], 'drawing' + date + '.png', {
              type: touse.type,
            })
            var fd = new FormData()
            fd.append('template', newfile)
            console.log(fd)

            axios
              .post('http://localhost:2000/templates/', fd, {})
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
          }}
          render={({ triggerSave, canvas }) => (
            <div>
              {this.state.isUploaded ? (
                <Redirect
                  to={{
                    pathname: '/imagememe',
                  }}
                />
              ) : (
                <div>
                  <div>{canvas}</div>
                  <Button
                    onClick={triggerSave}
                    id="imagepaintupload"
                    variant="contained"
                    color="primary"
                  >
                    Save as Template
                  </Button>
                  <VoiceControl tocontrol={'imagepaintupload'} />
                </div>
              )}
            </div>
          )}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(ImagePainter)
