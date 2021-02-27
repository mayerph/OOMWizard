import React from 'react'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import axios from 'axios'

import './voiceControl.css'

import {
  speechtotext,
  speechtotextreturn,
  speechtocontrol,
} from '../speechtotext/speechtotext.js'
import IconButton from '@material-ui/core/IconButton'
import MicIcon from '@material-ui/icons/Mic'
import Chip from '@material-ui/core/Chip'

class VoiceControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="voiceControl" id="voiceControl">
        <IconButton
          variant="contained"
          color="secondary"
          onClick={() => {
            speechtocontrol(this.props.tocontrol)
          }}
        >
          <MicIcon />
        </IconButton>
        <Chip icon={<MicIcon />} label="Upload" color="secondary" />
        <Chip icon={<MicIcon />} label="Cancel" color="secondary" />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(VoiceControl)
