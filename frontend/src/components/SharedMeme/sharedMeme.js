import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getMeme } from "../../actions"
import { Helmet, HelmetProvider } from 'react-helmet-async';

/**
 * for displaying the rendered image 
 * @param {*} props properties of the the SharedMeme component
 */
const SharedMeme = (props) => { 
  // url parameter
  const id = props.match.params.id

  // Returns dispatcher to emit actions as needed.
  const dispatch = useDispatch();

  // Allows you to extract data from the Redux store state, using a selector function.
  const memeState = useSelector(state => state.memeReducer);

  // enables side effects like http requests
  React.useEffect(() => {
    dispatch(getMeme(id))
  }, [dispatch, id]);
  
  // renders image after the response from server has received
  const MemeImage = () => {
    if (memeState.data && memeState.data.viewedMeme) {
      const meme = memeState.data.viewedMeme
      return <img src={ "http://localhost:2000" + meme.route } alt={ meme.name }></img>
    } else {
      return <span>no image</span>
    }
  }
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <meta property="og:type" content="article" />
          <meta property="og:title" content="When Great Minds Don’t Think Alike" />
          <meta property="og:description" content="How much does culture influence creative thinking?" />
          <meta property="og:image" content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />
        </Helmet>
        <MemeImage></MemeImage>
      </div>
    </HelmetProvider>
  )
}


export { SharedMeme }