import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { getApi } from '../../actions'
import { ReactPainter } from 'react-painter'

import './ImagePainter.css'

class ImagePainter extends React.Component {
  onApiLoad() {
    this.props.getApi('api')
  }

  render() {
    return (
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
              console.log(res.statusText)
            })
            .then((result) => {
              this.onApiLoad()
            })
        }}
        render={({ triggerSave, canvas }) => (
          <div>
            <div>{canvas}</div>
            <button onClick={triggerSave}>Save as Template</button>
          </div>
        )}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps, { getApi })(ImagePainter)
