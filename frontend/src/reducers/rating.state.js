const INITIAL_STATE = {
  overall: {},
  cur_user: {},
}

const ratings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOGGED_OUT':
      return {
        overall: state.overall,
        cur_user: {},
      }
    case 'UPDATE_RATING':
      console.log(action.payload)
      let avg_rating = action.payload.avg_rating
      let new_overall = { ...state.overall }
      new_overall[avg_rating.meme_id] = {
        rating: avg_rating.rating,
        nr_ratings: avg_rating.nr_ratings,
      }

      let user_rating = action.payload.user_rating
      let new_cur_user = { ...state.cur_user }
      if (user_rating) {
        new_cur_user[user_rating.meme_id] = {
          rating: user_rating.rating,
        }
      }
      return {
        overall: new_overall,
        cur_user: new_cur_user,
      }
    default:
      return state
  }
}
export default ratings
