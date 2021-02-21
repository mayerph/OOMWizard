import * as config from '../config.json'

const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`


export const post_comment = ((meme_id, comment) => (dispatch) => {
  let formData = new FormData()
  formData.set('meme_id', meme_id)
  formData.set('comment', comment)
  let url = `${backend_uri}/comments`

  fetch(url, {
    method: 'POST',
    body: formData,
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch({
          type: 'UPDATE_COMMENTS',
          payload: json,
        })
      } else {
        console.log(
          `Response to fetch comments failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
})

export const load_comments = (meme_id) => (dispatch) => {
  let url =
    `${backend_uri}/comments?` +
    new URLSearchParams({
      meme_id: meme_id,
    })

  fetch(url, {
    method: 'GET',
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch({
          type: 'UPDATE_COMMENTS',
          payload: json,
        })
      } else {
        console.log(
          `Response to fetch comments failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
}
