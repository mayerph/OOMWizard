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
import Tooltip from '@material-ui/core/Tooltip'
import Fade from '@material-ui/core/Fade'

class VoiceControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  chipTooltip() {
    return (
      <div className={'text-control-chips'}>
        <Chip icon={<MicIcon />} label="Upload" color="secondary" />
        <Chip icon={<MicIcon />} label="Cancel" color="secondary" />
      </div>
    )
  }

  render() {
    return (
      <div className="voiceControl" id="voiceControl">
        <Tooltip TransitionComponent={Fade} title={this.chipTooltip()}>
          <Chip
            avatar={
              <IconButton variant="contained" color="secondary">
                <MicIcon />
              </IconButton>
            }
            label="Dictate Action"
            clickable
            color="secondary"
            onClick={() => {
              speechtocontrol(this.props.tocontrol)
            }}
          ></Chip>
        </Tooltip>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(VoiceControl)
