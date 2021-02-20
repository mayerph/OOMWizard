import axios from 'axios'
export const addElement = (element) => ({
  type: 'ADD_ELEMENT',
  element,
})

export const removeElement = (id) => ({
  type: 'REMOVE_ELEMENT',
  id,
})

export const focusEditorState = (editorStateId, editorState, inlineStyles) => ({
  type: 'FOCUS_EDITOR_STATE',
  editorStateId,
  editorState,
  inlineStyles,
})

export const unfocusText = () => ({
  type: 'UNFOCUS_EDITOR_STATE',
})

export const getApi = (mode, apitype) => {
  let apiurl = null
  let atype = 'GET_API'
  if (apitype === 'template') {
    apiurl = 'http://localhost:2000/templates/'
  } else if (apitype === 'meme') {
    apiurl = 'http://localhost:2000/memes/'
    atype = 'GET_API_MEME'
  }
  return (dispatch) => {
    fetch(apiurl, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results
        //console.log(tileData)
        for (var i = 0; i < tileData.length; i++) {
          //console.log(tileData[i])
          tileData[i].route = 'http://localhost:2000' + tileData[i].route
          tileData[i].url = tileData[i].route
        }
        //console.log(tileData)
        dispatch({
          type: atype,
          payload: tileData,
          mode: mode,
          apitype: apitype,
        })
      })
  }
}

export const getApiImgFlip = (mode, apitype) => {
  return (dispatch) => {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes
        //console.log(tileData)
        dispatch({
          type: 'GET_API',
          payload: tileData,
          mode: mode,
          apitype: apitype,
        })
      })
  }
}
export const uploadUrl = (url) => {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      //console.log(blob)
    })
}

export const randomize = () => {
  return (dispatch) => {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes
        //console.log(tileData);
        dispatch({ type: 'RANDOMIZE', payload: tileData })
      })
  }
}
/* export const randomize = (state) => ({
  type: "RANDOMIZE",
  state,
}); */
export const sortByLikes = () => {
  return (dispatch) => {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes
        //console.log(tileData);
        dispatch({ type: 'SORTBYLIKES', payload: tileData })
      })
  }
}

export const autoplay = (state) => ({
  type: 'AUTOPLAY',
  state,
})

export const changeActive = (state, index) => {
  console.log(state)
  return (dispatch) => {
    dispatch({ type: 'ACTIVE', index: index, state })
  }
}
