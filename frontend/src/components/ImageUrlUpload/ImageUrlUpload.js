import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'

class ImageUrlUpload extends React.Component {
  //check if url is legit, regex from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ) // fragment locator
    return !!pattern.test(str)
  }
  uploadTemplate() {
    const container = document.getElementById('urlinput').value
    const containername = document.getElementById('nameinput').value
    console.log(container)
    console.log(containername)
    //check if url is legit, regex from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
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
    return (
      <div className="templateUpload" id="templateUpload">
        <input type="text" id="urlinput" />
        <input type="text" id="nameinput" />
        <button
          id="uploadButtonFile"
          type="submit"
          onClick={this.uploadTemplate.bind(this)}
        >
          Upload File
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, { getApi })(ImageUrlUpload)
