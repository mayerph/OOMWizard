import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import { uploadTemplate } from '../../actions'

class ImageUpload extends React.Component {
  uploadTemplate(img) {
    const container = document.getElementById('templateUpload')
    const file = container.querySelector('input[type="file"]').files[0]
    console.log(file)
    var fd = new FormData()
    fd.append('file', file)
    console.log(fd.get('file'))
    this.props.uploadTemplate(fd.get('file'))
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

export default connect(mapStateToProps, { uploadTemplate })(ImageUpload)
