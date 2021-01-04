import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMeme } from '../../actions'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import * as config from '../../config.json'

/**
 * single page for sharing a meme.
 * With the helmet module the sharing meta information are updated at runtime
 * The sharing works only when the proxy is started, which renders the page on the server-side
 * @param {*} props properties inclusive url params of the the SharedMeme component.
 */
const SharedMeme = (props) => {
  // url parameter
  const id = props.match.params.id

  // Returns dispatcher to emit actions as needed.
  const dispatch = useDispatch()

  // Allows you to extract data from the Redux store state, using a selector function.
  const memeState = useSelector((state) => state.memeReducer)

  // enables side effects like http requests
  React.useEffect(() => {
    dispatch(getMeme(id))
  }, [dispatch, id])

  // renders image after the response from server has received
  const MemeImage = () => {
    if (memeState.data && memeState.data.viewedMeme) {
      const meme = memeState.data.viewedMeme
      const destination = `${config.backend.protocol}://${config.backend.server}:${config.backend.port}`
      return (
        <span>
          <Helmet>
            <meta property="og:type" content="meme" />
            <meta property="og:title" content="Meme created with OOMWizard." />
            <meta
              property="og:description"
              content="Meme created with OOMWizard."
            />
            <meta property="og:image" content={destination + meme.route} />
          </Helmet>
          <img
            src={destination + meme.route}
            alt={meme.name}
            id="shared-image"
          ></img>
        </span>
      )
    } else {
      return <span>no image</span>
    }
  }
  return (
    <HelmetProvider>
      <MemeImage></MemeImage>
    </HelmetProvider>
  )
}

export { SharedMeme }
