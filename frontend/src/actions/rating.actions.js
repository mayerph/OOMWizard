import * as config from '../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const dispatch_rating = (dispatch, json_result) => {
  console.log('new ratings', json_result)
  dispatch({
    type: 'UPDATE_RATING',
    payload: json_result,
  })
}

export const post_rating = (meme_id, rating) => (dispatch) => {
  let formData = new FormData()
  formData.set('meme_id', meme_id)
  formData.set('rating', rating)
  let url = `${backend_uri}/rating`

  fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch_rating(dispatch, json)
      } else {
        console.log(
          `Response to post ratings failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
}

export const load_rating = (meme_id) => (dispatch) => {
  let url =
    `${backend_uri}/rating?` +
    new URLSearchParams({
      meme_id: meme_id,
    })

  fetch(url, {
    method: 'GET',
    credentials: 'include',
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch_rating(dispatch, json)
      } else {
        console.log(
          `Response to fetch comments failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
}
