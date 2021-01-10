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

export const getApi = (mode) => {
  return (dispatch) => {
    fetch('http://localhost:2000/templates/', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results
        console.log(tileData)
        for (var i = 0; i < tileData.length; i++) {
          console.log(tileData[i])
          tileData[i].route = 'http://localhost:2000' + tileData[i].route
          tileData[i].url = tileData[i].route
        }
        console.log(tileData)
        dispatch({ type: 'GET_API', payload: tileData, mode: mode })
      })
  }
}
export const getApiImgFlip = (mode) => {
  return (dispatch) => {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes
        console.log(tileData)
        dispatch({ type: 'GET_API', payload: tileData, mode: mode })
      })
  }
}

export const uploadTemplate = (img) => {
  console.log(img)
  var newtemplate = { template: img }
  return (dispatch) => {
    fetch('http://localhost:2000/templates/', {
      method: 'POST',
      body: newtemplate,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(newtemplate)
        console.log(results)
      })
  }
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
