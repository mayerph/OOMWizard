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

export const getApi = () => {
  return (dispatch) => {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((results) => {
        var tileData = results.data.memes
        //console.log(tileData);
        dispatch({ type: 'GET_API', payload: tileData })
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

export const getMeme = (id) => (dispatch) => {
  /*dispatch({
        type: "MEME_LOADING"
    });*/
  fetch(`http://localhost:2000/memes/${id}`, {
    method: 'GET',
  }).then(async (response) => {
    console.log('the response is', response)
    const data = await response.json()
    dispatch({
      type: 'GET_MEME_SUCCESS',
      payload: data,
    })
  })
}
