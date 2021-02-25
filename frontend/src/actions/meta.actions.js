import * as config from '../config.json'
const backend_uri = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`

const dispatch_update_meta_info = (dispatch, json_result) => {
  dispatch({
    type: 'UPDATE_META_INFO',
    payload: json_result,
  })
}

export const post_rating = (identifier, rating) => (dispatch) => {
  let formData = new FormData()
  formData.set('identifier', identifier)
  formData.set('rating', rating)
  let url = `${backend_uri}/meta/rate`

  fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch_update_meta_info(dispatch, json)
      } else {
        console.log(
          `Response to post ratings failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
}

export const load_meta = (identifier) => (dispatch) => {
  let url = fetch(`${backend_uri}/meta/${identifier}`, {
    method: 'GET',
    credentials: 'include',
  }).then(
    async (res) => {
      if (res.ok) {
        let json = await res.json()
        dispatch_update_meta_info(dispatch, json)
      } else {
        console.log(
          `Response to fetch comments failed with ${res.status}:${res.statusText}.`,
        )
      }
    },
    (reason) => console.log(reason),
  )
}
