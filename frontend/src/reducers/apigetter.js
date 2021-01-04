const INITIAL_STATE = { tileData: [] }
const tileDataBackup = [
  {
    url: 'https://i.imgflip.com/4o6bxw.jpg',
    name: 'Image',
    author: ' author',
  },
]
const apiGetter = (state = [], action) => {
  switch (action.type) {
    //should return an array of the images from the api, but doing something wrong with the GET
    case 'GET_API':
      //console.log(action.payload);
      return { ...state, tileData: action.payload }

    case 'RANDOMIZE':
      //var rt = state.tileData;
      var rt = action.payload
      for (let i = rt.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[rt[i], rt[j]] = [rt[j], rt[i]]
      }
      //console.log(rt);
      return { ...state, tileData: rt }

    case 'SORTBYLIKES':
      var st = action.payload.sort(function (a, b) {
        return b.name.length - a.name.length
      })
      return { ...state, tileData: st }

    case 'AUTOPLAY':
      if (state.auto == '4000') {
        return { ...state, auto: '1000000000' }
      } else {
        return { ...state, auto: '4000' }
      }

    default:
      //console.log(state);
      if (state.length !== 0) {
        return { ...state }
      }
      return { ...state, tileData: tileDataBackup, auto: '1000000000' }
  }
}

export default apiGetter
