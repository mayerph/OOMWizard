import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'

import { getApi } from '../../actions'

import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'

//https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

class MemePhotoCapture extends React.Component {
  onApiLoad() {
    this.props.getApi('api')
  }

  render() {
    return (
      <Camera
        onTakePhoto={(dataUri) => {
          console.log(dataUri)
          var byteString = atob(dataUri.split(',')[1])
          //console.log(byteString)
          var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0]
          console.log(mimeString)
          var ia = new Uint8Array(byteString.length)
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          console.log(ia)
          var blob = new Blob([ia], { type: mimeString })
          console.log(blob)
          var date = new Date()

          var newfile = new File([blob], 'camera_' + 'test' + '.png', {
            type: blob.type,
          })
          console.log(newfile)
          var fd = new FormData()
          fd.append('template', newfile)

          axios
            .post('http://localhost:2000/templates/', fd, {})
            .then((res) => {
              console.log(res.statusText)
            })
            .then((result) => {
              //this.onApiLoad()
            })

          //handleTakePhoto(dataUri)
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, {
  getApi,
})(MemePhotoCapture)
