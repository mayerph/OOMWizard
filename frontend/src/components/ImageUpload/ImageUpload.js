import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'

class ImageUpload extends React.Component {
  uploadTemplate() {
    const container = document.getElementById('templateUpload')
    const file = container.querySelector('input[type="file"]').files[0]
    console.log(file)
    var fd = new FormData()
    fd.append('template', file)
    axios
      .post('http://localhost:2000/templates/', fd, {})
      .then((res) => {
        console.log(res.statusText)
      })
      .then((result) => {
        this.onApiLoad()
      })
  }
  onApiLoad() {
    this.props.getApi('api')
  }

  render() {
    return (
      <div className="templateUpload" id="templateUpload">
        <input type="file" accept="image/png, image/jpeg, image/jpg" />
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

export default connect(mapStateToProps, { getApi })(ImageUpload)
