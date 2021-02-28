import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import Button from '@material-ui/core/Button'
import * as config from '../../../config.json'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import './videoTemplateList.style.css'
import { addNewTemplate } from '../../../actions/videoTemplate.action'
const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',

    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}))

const VideoTemplateList = (props) => {
  const callback = props.callback
  const selectTemplate = (index) => {
    callback(index)
  }

  const dispatch = useDispatch()

  const [file, setFile] = useState()
  const classes = useStyles()
  const videos = props.videos

  const onClickHandler = (e) => {
    e.stopPropagation()
    console.log('onClickHandler', file)
    const data = new FormData()
    data.append('template', file)
    console.log('data is', data)

    dispatch(addNewTemplate(data))
  }

  const onChangeHandler = (event) => {
    console.log('kann man damit was anfangen?', event.target.files[0])
    setFile(event.target.files[0])
  }

  const videoTemplateState = useSelector((state) => {
    if (
      !state.videoTemplatesReducer.error &&
      state.videoTemplatesReducer.data.videoTemplates
    ) {
      return state.videoTemplatesReducer
    }
  })

  let txtField = React.useRef(null)

  const choose = (event) => {
    console.log(txtField)
    if (!txtField) return
    txtField.current.click()
  }

  React.useEffect(() => {
    console.log('der state hat sich geändert')
  }, [videoTemplateState])

  return (
    <div className={`${classes.root} test2`}>
      <GridList className={`${classes.gridList} no-margin `}>
        <GridListTile
          className="special-border custom-grid-tile"
          onClick={choose}
        >
          <div className="template-upload">
            <input
              hidden
              onChange={onChangeHandler}
              ref={txtField}
              type="file"
              name="file"
            />

            <div className="upload-button">
              <Button
                variant="contained"
                color="primary"
                onClick={onClickHandler}
              >
                upload
              </Button>
            </div>
            <div>{file && file.name ? file.name : 'Select *.mp4'}</div>
          </div>
        </GridListTile>
        {videos.map((video, index) => (
          <GridListTile
            key={video.id}
            onClick={() => selectTemplate(index)}
            className={`default-border custom-grid-tile ${
              videoTemplateState.data.activeIndex == index
                ? 'active-border'
                : ''
            }`}
          >
            <img src={`${destination}/${video.thumbnail}`} />
            <GridListTileBar
              title=""
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
export default VideoTemplateList
