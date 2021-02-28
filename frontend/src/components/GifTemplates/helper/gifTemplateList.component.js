import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'

import Button from '@material-ui/core/Button'
import * as config from '../../../config.json'
import { useDispatch, useSelector } from 'react-redux'
import './gifTemplateList.style.css'
import { addNewTemplate } from '../../../actions/gifTemplate.action'
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

const GifTemplateList = (props) => {
  const callback = props.callback
  const selectTemplate = (index) => {
    callback(index)
  }

  const dispatch = useDispatch()

  const [file, setFile] = useState()
  const classes = useStyles()
  const gifs = props.gifs

  const onClickHandler = (e) => {
    e.stopPropagation()

    const data = new FormData()
    data.append('template', file)

    dispatch(addNewTemplate(data))
  }

  const onChangeHandler = (event) => {
    setFile(event.target.files[0])
  }

  const gifTemplateState = useSelector((state) => {
    if (
      !state.gifTemplatesReducer.error &&
      state.gifTemplatesReducer.data.gifTemplates
    ) {
      return state.gifTemplatesReducer
    }
  })

  let txtField = React.useRef(null)

  const choose = (event) => {
    if (!txtField) return
    txtField.current.click()
  }

  React.useEffect(() => {}, [gifTemplateState])

  return (
    <div className={`${classes.root} test2`}>
      <GridList className={`${classes.gridList} no-margin `}>
        <GridListTile
          className="special-border custom-grid-tile"
          onClick={choose}
        >
          <div className="template-upload">
            <input
              accept="image/gif"
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
            <div>{file && file.name ? file.name : 'Select *.gif'}</div>
          </div>
        </GridListTile>
        {gifs.map((gif, index) => (
          <GridListTile
            key={gif.id}
            onClick={() => selectTemplate(index)}
            className={`default-border custom-grid-tile ${
              gifTemplateState.data.activeIndex == index ? 'active-border' : ''
            }`}
          >
            <img src={`${destination}/${gif.thumbnail}`} />
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
export default GifTemplateList
