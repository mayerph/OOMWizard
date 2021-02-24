import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'

import { getApi } from '../../actions'

import Camera from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import { Redirect } from 'react-router-dom'

//https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
//got partially stuck when understanding how javascript handles datauri, here how I understanded the code snippet in the onTakePhoto function
//dataURI = the data for the image, in format [data details],[actual data] whereas data details in in format "data:image/png;base64"
//atob() = decodes the base 64 encoded string
//atob(dataUri.split(',')[1]) -> split the data string to only get the data and decode it to get the decoded version of the image itself
//dataUri.split(',')[0].split(':')[1].split(';')[0] -> first get the data details part, then split it again to get a string not containing "data", then split again to get the image format. In our case "image/png"
//Uint8Array() = creates an array of 8 bit unsigned integers
//new Uint8Array(byteString.length) = create an array of the length of the actual image data
//the following for string then fills this array with the UTF-16 code unit for each character in the actual data string
//this is needed since the Blob object we want to create can't accept the original actual data string and needs a Byte Array
//new Blob([ia], { type: mimeString }) -> creates a Blob with the image data and sets the type as the type from our image gotten earlier

//We convert this blob into a file so that we can send it to our backend
//We then send the image as FormData to our backend with axios directly in the component and reload the component
//this upload format is used in all of ther other template upload components

class MemePhotoCapture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pictureUrl: null,
    }
  }
  onApiLoad() {
    this.props.getApi('api')
  }

  render() {
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
                  console.log(res)
                  this.setState({
                    pictureUrl:
                      res.config.url.replace('templates/', '') +
                      res.data.route.substring(1),
                  })
                })
                .then((result) => {
                  this.onApiLoad()
                })

              //handleTakePhoto(dataUri)
            }}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, {
  getApi,
})(MemePhotoCapture)
